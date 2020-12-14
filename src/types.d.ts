import { ILocaleService } from './services/localeService'
import { ILoggerService } from './services/loggerService'

declare global {
  interface Window {
    myIpcRenderer: MyIpcRenderer,
    log: ILoggerService,
    i18n: ILocaleService;
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

declare module 'vue/types/vue' {
  interface Vue {
    $__: Function
  }
}
