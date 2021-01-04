/**
 * WARNING: this service is usable only through Electron main process
 * because it uses node modules which aren't available in renderer process
 */
import path from 'path';
import fs from 'fs';
import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import { ItemStruct, ItemDownloading, DownloadRequest, SlicedYoutube } from '@/config/litterals/index'
import sanitize from 'sanitize-filename'
import { BrowserWindow } from 'electron';
import _ from 'lodash';
import { generateUniqueId } from '../helpers/stringHelper';
import { ApplicationContainer } from '../di';
import { LoggerService } from "../services/loggerService"
import { FfmpegService } from './ffmpegService';

export interface IDownloadService {
    downloadAudio(item: ItemStruct, output: string): Promise<string>;
    downloadVideo(item: ItemStruct, output: string): Promise<string>;
    handleItem(item: ItemStruct): void;
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
    downloadRequest!: DownloadRequest;
    output!: string;

    constructor(request: DownloadRequest, output: string, win: BrowserWindow | null){
        this.browserWin = win;
        this.downloadRequest = request;
        this.output = output;
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

        if (this.remainingDownload > 0){
            setTimeout(() => {
                this.initDownload();            
            }, 3000);
        }
    }

    /**
     * Handle item's download lifecycle
     * @param item what we want to download
     */
    async handleItem(item: ItemStruct) {
        const audioPath = path.resolve(this.output, sanitize(`TEMP_audio_${item.downloadTry}_${item.title}.mp4`));
        const videoPath = path.resolve(this.output, sanitize(`TEMP_video_${item.downloadTry}_${item.title}.mp4`));
        const mergedOutputPath = path.resolve(this.output, `${item.title}.mp4`);
        item.filePath = mergedOutputPath;
        item.folderPath = this.output;
        try {
            await this.downloadAudio(item, audioPath);
            if (!this.downloadRequest.audioOnly) await this.downloadVideo(item, videoPath);

            // Slice videos next
            if (item.sliceList) {
                console.log("do the slicing here")
            }
            
            if (!this.downloadRequest.audioOnly) {
                await this.ffmpegService.mergeAudioVideo(audioPath, videoPath, mergedOutputPath);
            } else if (this.downloadRequest.audioOnly){
                fs.renameSync(audioPath, mergedOutputPath)
            }

            if (this.browserWin) this.browserWin.webContents.send('item-downloaded', item);
        } catch (err) {
            if (item.downloadTry! < 3) this.downloadRequest.itemSelected.push(item);
            else if (this.browserWin) this.browserWin.webContents.send('download-error', item)
            this.loggerService.error(err)
        }
        this.deleteTempFiles([audioPath, videoPath]);
        DownloadService.activeWorkers--;
    }

    downloadAudio(item: ItemStruct, output: string): Promise<string> {
        return new Promise( (resolve, reject) => {
            const url = `https://www.youtube.com/watch?v=${item.id}`;
            const audio = ytdl(url, { quality: 'highestaudio' });

            audio.on('error', (err) => reject(err))
            .on('progress', (chunkLength: number, downloaded: number, total: number) => {
                this.onItemProgress(chunkLength, downloaded, total, 'audio', item)
            })
            .pipe(fs.createWriteStream(output).on("error", (err) => reject(err)))
            .on('finish', () => resolve(output));
        })  
    }

    downloadVideo(item: ItemStruct, output: string): Promise<string> {
        return new Promise( (resolve, reject) => {
            const url = `https://www.youtube.com/watch?v=${item.id}`;
            const video = ytdl(url, { quality: 'highestvideo' });
            
            video.on('error', (err) => reject(err))
            .on('progress', (chunkLength: number, downloaded: number, total: number) => {
                this.onItemProgress(chunkLength, downloaded, total, 'video', item)
            })
            .pipe(fs.createWriteStream(output).on("error", (err) => reject(err)))
            .on('finish', () => resolve(output));
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
        return this.downloadRequest.itemSelected.length;
    }

    private onItemProgress(chunkLength: number, downloaded: number, total: number, type: string, videoDownloading: ItemStruct){
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

}