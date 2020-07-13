declare global {
  interface Window {
    myIpcRenderer: MyIpcRenderer,
  }
}

export interface MyIpcRenderer {
  downloadVideo(): Promise<any>;
  send(channel: string, data: any): Promise<any>;
  receive(channel: string, func: any): Promise<any>;

  /** @return A function that removes this listener. */
  // on(channel: string, listener: (...args: any[]) => void): () => void;
}
