import { AvailableFormats, VideoDetail } from "@/config/litterals";

export interface FetchedVideosState {
    selectedVideo: VideoDetail;
    fetchedVideos: VideoDetail[];
    currentFormat: AvailableFormats;
} 