// Preload (Isolated World)
import "reflect-metadata"
import { ApplicationContainer } from './di';
import { LoggerService } from "./services/loggerService"
import { contextBridge, ipcRenderer } from 'electron'



contextBridge.exposeInMainWorld(
    'myIpcRenderer',
    {
        invoke: (channel: string, data: any) => {
            // whitelist channels
            let validChannels = ["getVideoInfo"];
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, data);
            }
        },
        send: (channel: string, data: any) => {
            // whitelist channels
            let validChannels = ["download-videos", "download-progress", "item-downloaded", "open-external-url", "select-folder", "open-shell", "download-error"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel: string, func: any) => {
            let validChannels = ["download-progress", "item-downloaded", "open-external-url", "selected-folder", "download-error"];
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
            const loggerService = ApplicationContainer.resolve(LoggerService);
            return loggerService.logInfo(info);
        },
        
        error: (error: string | Error) => {
            const loggerService = ApplicationContainer.resolve(LoggerService);
            return loggerService.logError(error);
        },
    }

)