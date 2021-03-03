/**
 * Constantes
 */
import ytdl from 'ytdl-core';

export const YOUTUBE_SERVICE = "youtubeService";
export const LOGGER_SERVICE = "loggerService";
export const MAX_SLICE = 11;

export const ERROR_TYPES: Record<string, string> = {
    403: 'quota',
    404: 'notFound',
    400: 'apiKeyInvalid'
}

/**
 * Interfaces
 */

export interface DownloadRequest {
    readonly requestId: string;
    readonly itemSelected: VideoDetail[];
    readonly downloadFolder: string;
}

export interface IAlert {
    readonly type: string;
    readonly message: string;
}

export interface VideoDetail {
    readonly id: string;
    readonly title: string;
    readonly thumbnail: string;
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

export type ContextType = 'text-field';

export const MAX_WORKERS = 3;