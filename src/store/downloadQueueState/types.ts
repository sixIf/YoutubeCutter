import { VideoDetail } from "@/config/litterals";

export interface DownloadQueueState {
    downloading: VideoDetail[];
    inQueue: VideoDetail[];
    done: VideoDetail[];
    errors: VideoDetail[];
} 

export type QueueLists = "downloading" | "inQueue" | "done" | "errors";

export interface ItemsToQueue {
    queue: QueueLists;
    items: VideoDetail[];
}