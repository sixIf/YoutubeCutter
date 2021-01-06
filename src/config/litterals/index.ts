/**
 * Constantes
 */

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
    readonly channelTitle: string;
    readonly playlistTitle: string;
    readonly itemSelected: Array<ItemStruct>;
    readonly downloadFolder: string | null;
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
    readonly video: ItemStruct;
}

export interface ItemStruct {
    readonly id: string;
    readonly title: string;
    readonly thumbnail: string;
    readonly sliceList?: Array<SlicedYoutube>;
    readonly keepFullItem?: boolean;
    folderPath?: string;
    filePath?: string;
    downloadTry?: number;
}

export interface SlicedYoutube {
    readonly startTime: string;
    readonly duration: string;
    readonly name: string;
}