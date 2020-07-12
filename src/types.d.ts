declare global {
  interface Window {
    myIpcRenderer: MyIpcRenderer,
  }
}

export interface MyIpcRenderer {
  doThing(): Promise<any>;
  // send(channel: string, ...args: any[]): void;

  /** @return A function that removes this listener. */
  // on(channel: string, listener: (...args: any[]) => void): () => void;
}