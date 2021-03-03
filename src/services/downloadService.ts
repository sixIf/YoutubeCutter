/**
 * WARNING: this service is usable only through Electron main process
 * because it uses node modules which aren't available in renderer process
 */
import path from 'path';
import fs from 'fs';
import ytdl from 'ytdl-core';
import { VideoDetail, DownloadRequest, SlicedYoutube, MAX_WORKERS } from '@/config/litterals/index'
import sanitize from 'sanitize-filename'
import { BrowserWindow } from 'electron';
import _, { reject } from 'lodash';
import { ApplicationContainer } from '../di';
import { LoggerService } from "../services/loggerService"
import { FfmpegService } from './ffmpegService';
import { YOUTUBE_VIDEO_URL } from '@/config/litterals/youtube';

export interface IDownloadService {
    downloadAudio(item: VideoDetail, output: string): Promise<string>;
    downloadVideo(item: VideoDetail, output: string, bestQuality: string): Promise<string>;
    handleItem(item: VideoDetail): void;
    deleteTempFiles(files: string[]): void;
    startWorker(): void;
    handleDownloadRequest(request: DownloadRequest): void;
    pause(): void;
    cancel(): void;
    resume(): void;
    saveState(): void;
    prioritize(itemId: string): Promise<boolean>;
    removeItem(itemId: string): Promise<boolean>;
}

export class DownloadService implements IDownloadService {
    activeWorkers = 0;
    loggerService = ApplicationContainer.resolve(LoggerService);
    ffmpegService!: FfmpegService;
    browserWin: BrowserWindow | null = null;
    sucessDownloadList: VideoDetail[] = [];
    itemsToDownload: VideoDetail[];
    downloadRequest!: DownloadRequest;

    constructor(win: BrowserWindow | null){
        this.itemsToDownload = [];
        this.browserWin = win;
        this.ffmpegService = new FfmpegService;
    }
    
    handleDownloadRequest(request: DownloadRequest): void {
        // Add each item in the download array
        request.itemSelected.forEach(item => {
            item.folderPath = request.downloadFolder;
            this.itemsToDownload.push(item);
        });
        this.start();
    }

    start() {
        const activeWorkers = this.activeWorkers;
        for(let i=1; i <= MAX_WORKERS - activeWorkers; i++){
            this.startWorker()
        }
    }

    async startWorker() {
        this.activeWorkers++;
        while (this.itemsToDownload.length > 0){
            const item = this.itemsToDownload.shift()!;
            await this.handleItem(item);
        }
        this.activeWorkers--;
    }

    /**
     * Handle item's download lifecycle
     * @param item what we want to download
     */
    async handleItem(item: VideoDetail) {
        if (this.browserWin) this.browserWin.webContents.send('start-download-item', item); // notify renderer
        
        const videoNeeded = this.isThereVideoSlice(item.sliceList);
        // Set item download output
        if (item.sliceList.length > 1) {
            const newDir = path.join(item.folderPath!, sanitize(item.title));
            if(!fs.existsSync(newDir)) fs.mkdirSync(newDir)
            item.folderPath = newDir;
        }

        const tempAudioPath = path.resolve(item.folderPath!, sanitize(`TEMP_audio_${item.title}.mp3`));
        const tempVideoPath = path.resolve(item.folderPath!, sanitize(`TEMP_video_${item.title}.mp4`));
        let audioPath = path.resolve(item.folderPath!, sanitize(`${item.title}.mp3`));
        let videoPath = path.resolve(item.folderPath!, sanitize(`${item.title}.mp4`));
        const tempFiles = [];
        const fullVideoSlice = item.sliceList.shift();

        try {
            
            if (videoNeeded) { // Download the whole video with audio
                const bestFormat = await this.chooseBestVideoQuality(item);
                await this.downloadVideo(item, tempVideoPath, bestFormat);

                if (!item.videoHasAudio){
                    await this.downloadAudio(item, tempAudioPath);
                    await this.ffmpegService.convertToMp3(tempAudioPath, audioPath);
                    await this.ffmpegService.mergeAudioVideo(tempAudioPath, tempVideoPath, videoPath);
                    tempFiles.push(tempVideoPath, tempAudioPath);
                } else fs.renameSync(tempVideoPath, videoPath);
            } else { // Download only audio
                await this.downloadAudio(item, tempAudioPath);
                await this.ffmpegService.convertToMp3(tempAudioPath, audioPath);
                tempFiles.push(tempAudioPath);
            }
            
            // Create requested slices
            for (const slice of item.sliceList) {
                let outputPath = '';
                switch (slice.format.type) {
                    case 'video':
                        outputPath = this.findAvailableSlicePath(item.folderPath!, sanitize(`${slice.name}.mp4`))
                        await this.ffmpegService.sliceInput(videoPath, outputPath, slice.startTime, slice.endTime);
                        break;
                    case 'audio':
                        const currentAudioPath = !item.videoHasAudio ? audioPath : videoPath;
                        outputPath = this.findAvailableSlicePath(item.folderPath!, sanitize(`${slice.name}.mp3`));
                        await this.ffmpegService.sliceInput(currentAudioPath, outputPath, slice.startTime, slice.endTime);
                        break;
                }
            }

            // Handle main slice
            switch (fullVideoSlice!.format.type) {
                case 'video':
                    if(!item.videoHasAudio) tempFiles.push(audioPath);
                    if (fullVideoSlice!.isActive) {
                        item.filePath = videoPath;
                    }
                    else {
                        tempFiles.push(videoPath);
                        item.filePath = '';
                    }
                    break;
                case 'audio':
                    if(videoNeeded) tempFiles.push(videoPath);
                    if (fullVideoSlice!.isActive) {
                        item.filePath = audioPath;
                    }
                    else {
                        tempFiles.push(audioPath);
                        item.filePath = '';
                    }
                    break;
            }

            if (this.browserWin) this.browserWin.webContents.send('item-downloaded', item); // notify renderer

        } catch (err) {
            if (this.browserWin) this.browserWin.webContents.send('download-error', item);
            this.loggerService.error(err)
        } finally {
            this.deleteTempFiles(tempFiles);
        }
    }

    downloadAudio(item: VideoDetail, tempOutput: string): Promise<string> {
        return new Promise( (resolve, reject) => {
            const url = `${YOUTUBE_VIDEO_URL}${item.id}`;
            const audio = ytdl(url, { quality: 'highestaudio' });
            
            audio.on('error', (err) => reject(err))
            .on('info', (info: ytdl.videoInfo, format: ytdl.videoFormat) => item.bestAudioFormat = format.container)
            .pipe(fs.createWriteStream(tempOutput).on("error", (err) => reject(err)))
            .on('finish', () => resolve(tempOutput));
        })  
    }

    downloadVideo(item: VideoDetail, tempOutput: string, bestQuality: string): Promise<string> {
        return new Promise( (resolve, reject) => {
            const url = `${YOUTUBE_VIDEO_URL}${item.id}`;
            const video = ytdl(url, { filter: format => format.container === 'mp4' ,quality: bestQuality });

            video.on('error', (err) => reject(err))
            .on('info', (info: ytdl.videoInfo, format: ytdl.videoFormat) => {
                item.bestVideoFormat = format.container;
                item.videoHasAudio = format.hasAudio;
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

    async prioritize(itemId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const index = _.findIndex(this.itemsToDownload, (value: VideoDetail) => {
                return value.id == itemId;
            });
            
            if (index != -1) {
                const elem = this.itemsToDownload.splice(index, 1)[0];
                this.itemsToDownload.unshift(elem);
                resolve(true);
            } else {
                reject(false);
            }
        })
    }

    async removeItem(itemId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const deletedItems = _.remove(this.itemsToDownload, (value: VideoDetail) => {
                return value.id == itemId;
            });
            
            if (deletedItems.length != 0) resolve(true);
            else reject(false);
        })
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
    saveState(): void {
        throw new Error('Method not implemented.');
    }    

    private isThereVideoSlice(sliceList: SlicedYoutube[]): boolean{
        return _.findIndex(sliceList, (slice) => { return slice.format.type === "video" }) != -1;
    }

    private findAvailableSlicePath(folderPath: string, fileName: string){
        let count = 1;
        let currentPath = path.resolve(folderPath, fileName);
        while(fs.existsSync(currentPath)){
            let newFileName = `(${count++}) ` + fileName;
            currentPath = path.resolve(folderPath, newFileName);
        }
        return currentPath;
    }

    /**
     * 
     * @param item video for which we search the format
     * Downloading a UltraHD seems to be broken for some videos
     * hence the limitation we enforce with 1080 max
     */
    private chooseBestVideoQuality(item: VideoDetail): Promise<string> {
        return new Promise ( async (resolve, reject) => {
            if (item.formats.length == 0) {
                try {
                    const videoInfo = await ytdl.getInfo(YOUTUBE_VIDEO_URL.concat(item.id));
                    item.formats = videoInfo.formats
                } catch (err) {
                    reject(err)
                }
            }

            const sortedFormats = _.orderBy(item.formats, (format) => format.height, 'desc')
            const chosenFormat = _.find(sortedFormats, (format) => {
                if (format.height) return format.container == 'mp4' && format.height! <= 1080
                else return false
            });

            if (chosenFormat) resolve(chosenFormat.itag.toString());
            else (resolve('highestvideo'));
        })
    }

}