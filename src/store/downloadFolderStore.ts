import { LOCAL_STORAGE_FOLDER } from "@/config/litterals";

export interface IDownloadFolderStore {
    getDownloadFolder(): string | null;
    setDownloadFolder(key: string): boolean;
}

export class DownloadFolderStore implements IDownloadFolderStore {
    getDownloadFolder() {
        return window.localStorage.getItem(LOCAL_STORAGE_FOLDER);
    }
    setDownloadFolder(key: string) {
        try {
            window.localStorage.setItem(LOCAL_STORAGE_FOLDER, key);
            return true;
        } catch (err) {
            return false;
        }
    }
}