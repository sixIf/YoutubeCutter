// Preload (Isolated World)
import { contextBridge, ipcRenderer } from 'electron'



contextBridge.exposeInMainWorld(
    'myIpcRenderer',
    {
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