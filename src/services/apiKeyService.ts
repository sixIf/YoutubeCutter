import { IApiKeyStore } from "@/store/apiKeyStore.ts";
import { injectable, inject } from "tsyringe";

export interface IApiKeyService {
  getApiKey(): string | null;
  setApiKey(key: string | null): boolean;
}

@injectable()
export class ApiKeyService implements IApiKeyService {

  constructor(@inject("IApiKeyStore") private apiKeyStoreAccessor: IApiKeyStore) { }

  getApiKey() {
    return this.apiKeyStoreAccessor.getApiKey();
  }

  setApiKey(key: string | null) {
    if (key != null)
      return this.apiKeyStoreAccessor.setApiKey(key);
    else
      return false
  }
}