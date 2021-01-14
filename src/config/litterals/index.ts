/**
 * Constantes
 */
import ytdl from 'ytdl-core';

export const YOUTUBE_SERVICE = "youtubeService";
export const DOWNLOAD_FOLDER_SERVICE = "downloadFolderService";
export const LOGGER_SERVICE = "loggerService";

export const ERROR_TYPES: Record<string, string> = {
    403: 'quota',
    404: 'notFound',
    400: 'apiKeyInvalid'
}

export const API_KEY = 'AIzaSyDeSxTCCjIY0GQGLLFsw7aZeZqtdiSvznI'

export const LOCAL_STORAGE_FOLDER = "DownloadFolder"
export const LOCAL_STORAGE_LOCALE = "CurrentLocale"

/**
 * Interfaces
 */

export interface DownloadRequest {
    readonly requestId: string;
    readonly audioOnly: boolean;
    readonly itemSelected: VideoDetail[];
    readonly downloadFolder: string;
}

export interface IAlert {
    readonly type: string;
    readonly message: string;
}

export interface ItemDownloading {
    progressAudio: string;
    progressVideo: string;
    readonly type: string;
    readonly audioOnly: boolean;
    readonly video: VideoDetail;
}

export interface VideoDetail {
    readonly id: string;
    readonly title: string;
    readonly thumbnail: string;
    readonly keepFullItem?: boolean;
    sliceList: SlicedYoutube[];
    formats: ytdl.videoFormat[];
    bestAudioFormat?: string;
    bestVideoFormat?: string;
    videoHasAudio?: boolean;
    toDownload: boolean;
    folderPath?: string;
    filePath?: string;
    downloadTry?: number;
}

export interface SlicedYoutube {
    startTime: number;
    format: AvailableFormats;
    endTime: number;
    name: string;
    isActive: boolean;
}

export interface AvailableFormats {
    type: "video" | "audio";
    value: string;
}

export const DOWNLOAD_FORMATS: AvailableFormats[] = [
    {
        type: 'video',
        value: 'mp4'
    },
    {
        type: 'audio',
        value: 'mp3'
    },
]

export interface SliceToUpdate {
    index: number;
    updatedSlice: SlicedYoutube;
}

export interface PlayRequest {
    start: number;
    end: number;
}