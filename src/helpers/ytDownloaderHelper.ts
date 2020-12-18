import path from 'path';
import fs from 'fs';
import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import ffmpeg from 'fluent-ffmpeg';
import pathToFfmpeg from 'ffmpeg-static';
import { ItemStruct, ItemDownloading, DownloadRequest } from '@/config/litterals/index'
import sanitize from 'sanitize-filename'
import { BrowserWindow } from 'electron';
import _ from 'lodash';
import { generateUniqueId } from './stringHelper';
import { ApplicationContainer } from '../di';
import { LoggerService } from "../services/loggerService"

const loggerService = ApplicationContainer.resolve(LoggerService);


export async function downloadItems(args: DownloadRequest, output: string, win: BrowserWindow | null) {
    loggerService.info(JSON.stringify(args))
    while (args.itemSelected.length != 0) {
        const videoToFetch = args.itemSelected.shift()!;
        videoToFetch.downloadTry = videoToFetch.downloadTry ? videoToFetch.downloadTry + 1 : 1;
        try {
            loggerService.info(JSON.stringify(await download(videoToFetch, args.audioOnly, output, win)));
            if (win) win.webContents.send('item-downloaded', videoToFetch)
        } catch (err) {
            loggerService.info(`An error occurred:  ${err}`);
            if (videoToFetch.downloadTry < 3) args.itemSelected.push(videoToFetch);
            else {
                loggerService.info("Max try exceeded, this video failed:")
                loggerService.info(JSON.stringify(videoToFetch))
                const downloadRequestError: DownloadRequest = {
                    requestId: args.requestId,
                    audioOnly: args.audioOnly,
                    playlistTitle: args.playlistTitle,
                    channelTitle: args.channelTitle,
                    itemSelected: [videoToFetch],
                    downloadFolder: args.downloadFolder,
                };
                if (win) win.webContents.send('download-error', downloadRequestError)
            }
        }
    }
}

export async function getVideoInfo(videoId: string){
    return ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
}

export async function getPlaylistInfo(playlistId: string, options?: ytpl.Options){
    return ytpl(playlistId, options);
}

function download(videoToFetch: ItemStruct | undefined, audioOnly: boolean, output: string, win: BrowserWindow | null) {
    return new Promise((resolve, reject) => {
        // Notify renderer to display the donwload icon
        if (videoToFetch == undefined)
            reject("video undefined")
        else {

            const url = `https://www.youtube.com/watch?v=${videoToFetch.id}`;
            const audioOutputMp4 = path.resolve(output, sanitize(`TEMP_AUDIO_${videoToFetch.title}_${generateUniqueId()}.mp4`));
            const audioOutputMp3 = path.resolve(output, sanitize(`${videoToFetch.title}.mp3`));
            const mainOutput = path.resolve(output, sanitize(`${videoToFetch.title}.mp4`));

            videoToFetch.filePath = audioOnly ? audioOutputMp3 : mainOutput;
            videoToFetch.folderPath = output;

            let fileAlreadyExist = false;

            if (audioOnly)
                fileAlreadyExist = fs.existsSync(audioOutputMp3) ? true : false;
            else
                fileAlreadyExist = fs.existsSync(mainOutput) ? true : false;

            const onProgress = (chunkLength: number, downloaded: number, total: number, type: string, videoDownloading: ItemStruct) => {
                const percent = downloaded / total;
                let objectToSend: ItemDownloading = {
                    progressAudio: type == 'audio' ? `${(percent * 100).toFixed(2)}` : '100',
                    progressVideo: type == 'video' ? `${(percent * 100).toFixed(2)}` : '0',
                    type: type, audioOnly: audioOnly,
                    video: videoDownloading
                }
                if (win)
                    win.webContents.send('download-progress', objectToSend)
            };

            const handleDownloadError = (videoError: ItemStruct, err: Error, source: string) => {
                unlikTempAudio('\nYtdl error', false);
                reject(`\nSource:${source}\nVideo:${videoError.title}\n${err}`)
            }

            const unlikTempAudio = (resolveMessage: string, resolved: boolean) => {
                fs.unlink(audioOutputMp4, err => {
                    if (err) loggerService.error(err);
                    if (!resolved) loggerService.info("I swear im unlinking")
                    else if (resolved) resolve(resolveMessage)
                });
            }

            if (fileAlreadyExist)
                resolve('File already downloaded')
            else {
                loggerService.info('downloading audio track');
                ffmpeg.setFfmpegPath(
                    // Ffmpeg.exe is unpacked into app.asar.unpacked
                    pathToFfmpeg.toString().replace("app.asar", "app.asar.unpacked")
                );

                ytdl(url, {
                    filter: format => format.container === 'mp4' && !format.qualityLabel,
                }).on('error', (err) => handleDownloadError(videoToFetch, err, 'ytdl'))
                    .on('progress', (chunkLength: number, downloaded: number, total: number) => {
                        onProgress(chunkLength, downloaded, total, 'audio', videoToFetch)
                    })

                    // Write audio to file since ffmpeg supports only one input stream.
                    .pipe(fs.createWriteStream(audioOutputMp4).on("error", (err) => {
                        loggerService.info(`Fs write error: ${err}`);
                    }))
                    .on('finish', () => {
                        loggerService.info(`Audio track downloaded for ${videoToFetch.title}`)
                        if (!audioOnly) {
                            // Download and merge video
                            loggerService.info('\ndownloading video');
                            const video = ytdl(url, {
                                filter: format => format.container === 'mp4' && !format.audioBitrate,
                            })
                            video.on('progress', (chunkLength: number, downloaded: number, total: number) => {
                                onProgress(chunkLength, downloaded, total, 'video', videoToFetch)
                            });
                            ffmpeg()
                                .input(video)
                                .videoCodec('copy')
                                .input(audioOutputMp4)
                                .audioCodec('copy')
                                .save(mainOutput)
                                .on('error', (err) => handleDownloadError(videoToFetch, err, 'ffmpeg-video'))
                                .on('end', () => unlikTempAudio(`\nFinished downloading, saved to ${mainOutput}`, true));
                        }
                        else {
                            // Convert audio to mp3
                            ffmpeg()
                                .input(audioOutputMp4)
                                .audioCodec('libmp3lame')
                                .save(audioOutputMp3)
                                .on('error', (err) => { handleDownloadError(videoToFetch, err, 'ffmpeg-mp3') })
                                .on('end', () => unlikTempAudio(`\nFinished converting audio to mp3, saved to ${audioOutputMp3}`, true));
                        }
                    });
            }
        }
    })
}
