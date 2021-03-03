import { ILoggerService } from './services/loggerService'

declare global {
  interface Window {
    myIpcRenderer: MyIpcRenderer,
    log: ILoggerService,
    youtube: Youtube;
    onYouTubeIframeAPIReady: Function;
  }
}

export interface MyIpcRenderer {
  send(channel: string, data: any): Promise<any>;
  invoke(channel: string, data: any): Promise<any>;
  receive(channel: string, func: any): Promise<any>;
}

export interface MyLogger {
  info(info: string): string; 
  error(info: string): string; 
}

interface Youtube{
  createPlayer(videoID: string, playerID: string): any;
}