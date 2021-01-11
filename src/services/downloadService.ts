/**
 * WARNING: this service is usable only through Electron main process
 * because it uses node modules which aren't available in renderer process
 */
import path from 'path';
import fs from 'fs';
import ytdl from 'ytdl-core';
import { VideoDetail, ItemDownloading, DownloadRequest, SlicedYoutube } from '@/config/litterals/index'
import sanitize from 'sanitize-filename'
import { BrowserWindow } from 'electron';
import _ from 'lodash';
import { ApplicationContainer } from '../di';
import { LoggerService } from "../services/loggerService"
import { FfmpegService } from './ffmpegService';
import { youtubeVideoUrl } from '@/config/litterals/youtube';

export interface IDownloadService {
    downloadAudio(item: VideoDetail, output: string): Promise<string>;
    downloadVideo(item: VideoDetail, output: string): Promise<string>;
    handleItem(item: VideoDetail): void;
    deleteTempFiles(files: string[]): void;
    initDownload(): void;
    pause(): void;
    cancel(): void;
    resume(): void;
    removeItem(videoID: string): void;
}

export class DownloadService implements IDownloadService {
    static activeWorkers = 0;
    loggerService = ApplicationContainer.resolve(LoggerService);
    ffmpegService!: FfmpegService;
    browserWin: BrowserWindow | null = null;
    sucessDownloadList: VideoDetail[] = [];
    errorDownloadList: VideoDetail[] = [];
    downloadRequest!: DownloadRequest;
    nbToDownload = 0;
    output!: string;

    constructor(request: DownloadRequest, win: BrowserWindow | null){
        this.browserWin = win;
        this.downloadRequest = request;
        this.nbToDownload = this.downloadRequest.itemSelected.length;
        this.output = this.downloadRequest.downloadFolder;
        this.ffmpegService = new FfmpegService;
        this.initDownload();    
    }

    /**
     * Launch next item to download in request
     * if a worker is available, otherwise retry
     * after 3 seconds
     */
    initDownload(): void {
        if (DownloadService.activeWorkers < 3) {
            const itemToDownload = this.downloadRequest.itemSelected.shift();
            if(itemToDownload) {
                DownloadService.activeWorkers++;
                itemToDownload.downloadTry = itemToDownload.downloadTry ? itemToDownload.downloadTry + 1 : 1;
                this.handleItem(itemToDownload);
            }
        }

        console.log(`remaining ${this.remainingDownload}\n downloaded ${this.sucessDownloadList.length}\n error ${this.errorDownloadList.length}`)
        if (this.remainingDownload > 0){
            setTimeout(() => {
                console.log('Setting timeout')
                this.initDownload();            
            }, 3000);
        }
    }

    /**
     * Handle item's download lifecycle
     * @param item what we want to download
     */
    async handleItem(item: VideoDetail) {
        const tempAudioPath = path.resolve(this.output, sanitize(`TEMP_audio_${item.downloadTry}_${item.title}`));
        const tempVideoPath = path.resolve(this.output, sanitize(`TEMP_video_${item.downloadTry}_${item.title}`));
        item.folderPath = this.output;

        try {
            if (item.formats.length == 0) ytdl.getInfo(item.id); // Get info then we have to choose a video format max 1080
            if (this.isThereVideoSlice(item.sliceList)) { // Download the whole video with audio
                await this.downloadVideo(item, tempVideoPath);
                item.filePath = path.resolve(this.output, `${sanitize(item.title)}.${item.bestVideoFormat}`);
                if (item.videoHasAudio) fs.renameSync(tempVideoPath, item.filePath);
                else {
                    await this.downloadAudio(item, tempAudioPath);
                    const value = await this.ffmpegService.mergeAudioVideo(tempAudioPath, tempVideoPath, item.filePath);
                    console.log(value)
                }
            } else { // Download only audio
                await this.downloadAudio(item, tempAudioPath);
                item.filePath = path.resolve(this.output, `${sanitize(item.title)}.mp3`);
                await this.ffmpegService.convertToMp3(tempAudioPath, item.filePath)
            }
            
            // Slice videos next
            if (item.sliceList) {
                console.log("do the slicing here")
            }

            if (this.browserWin) this.browserWin.webContents.send('item-downloaded', item);
            this.sucessDownloadList.push(item);
        } catch (err) {
            if (item.downloadTry! < 3) this.downloadRequest.itemSelected.push(item);
            else {
                this.errorDownloadList.push(item);
                if (this.browserWin) this.browserWin.webContents.send('download-error', item);
            }
            this.loggerService.error(err)
        }
        this.deleteTempFiles([tempAudioPath, tempVideoPath]);
        DownloadService.activeWorkers--;
    }

    downloadAudio(item: VideoDetail, tempOutput: string): Promise<string> {
        return new Promise( (resolve, reject) => {
            const url = `${youtubeVideoUrl}${item.id}`;
            const audio = ytdl(url, { quality: 'highestaudio' });
            
            audio.on('error', (err) => reject(err))
            .on('info', (info: ytdl.videoInfo, format: ytdl.videoFormat) => {
                item.bestAudioFormat = format.container;
                console.log(`Chosen Format ${item.bestAudioFormat} ${format.itag}`);
            })
            .on('progress', (chunkLength: number, downloaded: number, total: number) => {
                this.onItemProgress(chunkLength, downloaded, total, 'audio', item)
            })
            .pipe(fs.createWriteStream(tempOutput).on("error", (err) => reject(err)))
            .on('finish', () => resolve(tempOutput));
        })  
    }

    downloadVideo(item: VideoDetail, tempOutput: string): Promise<string> {
        return new Promise( (resolve, reject) => {
            const url = `${youtubeVideoUrl}${item.id}`;
            const video = ytdl(url, { filter: format => format.container === 'mp4' ,quality: 'highestvideo' });

            video.on('error', (err) => reject(err))
            .on('info', (info: ytdl.videoInfo, format: ytdl.videoFormat) => {
                item.bestVideoFormat = format.container;
                item.videoHasAudio = format.hasAudio;
                console.log(`Chosen video Format ${item.bestVideoFormat} ${format.itag}`);
            })
            .on('progress', (chunkLength: number, downloaded: number, total: number) => {
                this.onItemProgress(chunkLength, downloaded, total, 'video', item)
            })
            .pipe(fs.createWriteStream(tempOutput).on("error", (err) => reject(err)))
            .on('finish', () => resolve(tempOutput));
        })
    }

    deleteTempFiles(files: string[]): void {
        files.forEach(file => {
            fs.unlink(file, err => {
                if (err) this.loggerService.error(err);
            });
        });
    }

    pause(): void {
        throw new Error('Method not implemented.');
    }
    cancel(): void {
        throw new Error('Method not implemented.');
    }
    resume(): void {
        throw new Error('Method not implemented.');
    }
    removeItem(videoID: string): void {
        throw new Error('Method not implemented.');
    }    

    get remainingDownload(): number {
        return this.nbToDownload - (this.sucessDownloadList.length + this.errorDownloadList.length);
    }

    private onItemProgress(chunkLength: number, downloaded: number, total: number, type: string, videoDownloading: VideoDetail){
        const percent = downloaded / total;
        let objectToSend: ItemDownloading = {
            progressAudio: type == 'audio' ? `${(percent * 100).toFixed(2)}` : '100',
            progressVideo: type == 'video' ? `${(percent * 100).toFixed(2)}` : '0',
            type: type, audioOnly: this.downloadRequest.audioOnly,
            video: videoDownloading
        }
        if (this.browserWin)
            this.browserWin.webContents.send('download-progress', objectToSend);
    }

    private isThereVideoSlice(sliceList: SlicedYoutube[]): boolean{
        return _.findIndex(sliceList, (slice) => { return slice.format.type == 'video' ? true : false}) != -1
    }

}