// Preload (Isolated World)
import { contextBridge, ipcRenderer } from 'electron'



contextBridge.exposeInMainWorld(
  'myIpcRenderer',
  {
    send: (channel: string, data: any) => {
      // whitelist channels
      let validChannels = ["toMain", "do-a-thing"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel: string, func: any) => {
      let validChannels = ["fromMain", "it-is-good"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  }
)