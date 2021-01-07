import { VideoDetail } from "@/config/litterals";

export interface FetchedVideosState {
    selectedVideo: VideoDetail;
    fetchedVideos: VideoDetail[];
} 