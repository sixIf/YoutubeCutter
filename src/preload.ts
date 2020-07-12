// Preload (Isolated World)
import { contextBridge, ipcRenderer } from 'electron'



contextBridge.exposeInMainWorld(
  'myIpcRenderer',
  {
    doThing: () => {
      console.log('On y est dans le preload api')
      ipcRenderer.send('do-a-thing')
    }
  }
)