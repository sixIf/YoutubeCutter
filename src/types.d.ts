declare global {
  interface Window {
    myIpcRenderer: MyIpcRenderer,
  }
}

export interface MyIpcRenderer {
  send(channel: string, data: any): Promise<any>;
  invoke(channel: string, data: any): Promise<any>;
  receive(channel: string, func: any): Promise<any>;
}
