// Preload (Isolated World)
import "reflect-metadata"
import { ApplicationContainer } from './di';
import { LoggerService } from "./services/loggerService"
import { LocaleService } from "./services/localeService"
import { contextBridge, ipcRenderer } from 'electron'

const loggerService = ApplicationContainer.resolve(LoggerService);
const localeService = ApplicationContainer.resolve(LocaleService);

contextBridge.exposeInMainWorld(
    'myIpcRenderer',
    {
        invoke: (channel: string, data: any) => {
            // whitelist channels
            let validChannels = ["getVideoInfo", "getPlaylistVideos", "getVideoIdFromUrl", "getPlaylistIdFromUrl"];
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, data);
            }
        },
        send: (channel: string, data: any) => {
            // whitelist channels
            let validChannels = ["download-videos", "download-progress", "item-downloaded", "open-external-url", "select-folder", "open-shell", "download-error", "add-single-video", "explore-channel"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel: string, func: any) => {
            let validChannels = ["download-progress", "item-downloaded", "open-external-url", "selected-folder", "download-error", "add-single-video", "explore-channel"];
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

contextBridge.exposeInMainWorld(
    'i18n',
    {
        translate: (phrase: string, args?: any) => {
            return localeService.translate(phrase, args);
        },
        
        setLocale: (locale: string) => {
            return localeService.setLocale(locale);
        },

        getCurrentLocale: () => {
            return localeService.getCurrentLocale();
        },
        
        getLocales: () => {
            return localeService.getLocales();
        },
    }
)