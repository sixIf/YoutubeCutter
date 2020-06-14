import { IApiKeyStore } from "@/store/apiKeyStore.ts";
import { injectable, inject } from "tsyringe";

export interface IApiKeyService {
  getApiKey(): string | null;
  setApiKey(key: string | null): boolean;
}

@injectable()
export class ApiKeyService implements IApiKeyService {
  // apiKeyStoreAccessor: IApiKeyStore;

  constructor(@inject("IApiKeyStore") private apiKeyStoreAccessor: IApiKeyStore) { }

  getApiKey() {
    console.log('get Api key IApiKeyService');
    return this.apiKeyStoreAccessor.getApiKey();
  }

  setApiKey(key: string | null) {
    console.log('set Api key IApiKeyService');
    if (key)
      return this.apiKeyStoreAccessor.setApiKey(key);
    else
      return false
  }
}