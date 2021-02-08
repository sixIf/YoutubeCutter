// Preload (Isolated World)
import "reflect-metadata"
import { ApplicationContainer } from './di';
import { LoggerService } from "./services/loggerService"
import { contextBridge, ipcRenderer } from 'electron'

const loggerService = ApplicationContainer.resolve(LoggerService);

contextBridge.exposeInMainWorld(
    'myIpcRenderer',
    {
        invoke: (channel: string, data: any) => {
            let validChannels = [
                "get-video-infos", "get-playlist-videos", "get-default-download-folder", "get-video-id-from-url", 
                "get-playlist-id-from-url", "get-current-locale"
            ];
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, data);
            }
        },
        send: (channel: string, data: any) => {
            let validChannels =  [
                "download-videos", "set-current-locale", "set-locale-messages", "open-context-menu", 
                "download-progress", "item-downloaded", "open-external-url", "select-folder",
                "open-shell", "download-error", "add-single-video", "explore-channel",
                "minimize-window", "maximize-window", "close-window"
            ];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel: string, func: any) => {
            let validChannels = [
                "download-progress", "set-current-locale", "set-locale-messages", "item-downloaded",
                "open-external-url", "selected-folder", "download-error", "add-single-video"
            ];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
)

contextBridge.exposeInMainWorld(
    'log',
    {
        info: (info: string) => {
            return loggerService.info(info);
        },
        
        error: (error: string | Error) => {
            return loggerService.error(error);
        },
    }
)