import "reflect-metadata"
import { ipcRenderer } from 'electron'
import { ApplicationContainer } from './di';
import { LoggerService } from "./services/loggerService"

const loggerService = ApplicationContainer.resolve(LoggerService);

/** *
 * Handle context menu creation
*/
window.addEventListener('contextmenu', async (e) => {
    e.preventDefault()
    ipcRenderer.send('open-context-menu', {});
  }, false)