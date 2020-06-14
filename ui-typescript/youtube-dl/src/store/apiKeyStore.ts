import { LOCAL_STORAGE_KEY } from "@/config/litterals";

export interface IApiKeyStore {
  getApiKey(): string | null;
  setApiKey(key: string): boolean;
}

export class ApiKeyStore implements IApiKeyStore {
  getApiKey() {
    console.log('get Api key');
    return window.localStorage.getItem(LOCAL_STORAGE_KEY);
  }
  setApiKey(key: string) {
    console.log('set Api key');
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, key);
      return true;
    } catch (err) {
      return false;
    }
  }
}