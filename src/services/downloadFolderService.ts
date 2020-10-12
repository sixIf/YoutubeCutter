import { IDownloadFolderStore } from "@/store/downloadFolderStore.ts";
import { injectable, inject } from "tsyringe";

export interface IDownloadFolderService {
    getDownloadFolder(): string | null;
    setDownloadFolder(key: string | null): boolean;
}

@injectable()
export class DownloadFolderService implements IDownloadFolderService {

    constructor(@inject("IDownloadFolderStore") private downloadFolderStoreAccessor: IDownloadFolderStore) { }

    getDownloadFolder() {
        return this.downloadFolderStoreAccessor.getDownloadFolder();
    }

    setDownloadFolder(key: string | null) {
        if (key)
            return this.downloadFolderStoreAccessor.setDownloadFolder(key);
        else
            return false
    }
}