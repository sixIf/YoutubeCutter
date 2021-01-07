import { IYoutubeClient } from "@/api/youtubeClient";
import { VideoDetail } from "@/config/litterals";
import { cpuUsage } from "process";
import { injectable, inject } from "tsyringe";
import ytdl from "ytdl-core";
import ytpl from "ytpl";

export interface IYoutubeService {
    findVideo(videoId: string): Promise<VideoDetail>;
    findPlaylistVideos(playlistID: string): Promise<VideoDetail[]>;
    getVideoIdFromUrl(videoUrl: string): Promise<string>;
    getPlaylistIdFromUrl(playlistUrl: string): Promise<string>;
}

@injectable()
export class YoutubeService implements IYoutubeService {


    constructor(@inject("IYoutubeClient") private youtubeClient: IYoutubeClient) { }
    
    async getPlaylistIdFromUrl(playlistUrl: string): Promise<string> {
        const response = await this.youtubeClient.getPlaylistIdFromUrl(playlistUrl);
        return response;
    }
    async getVideoIdFromUrl(videoUrl: string): Promise<string> {
        const response = await this.youtubeClient.getVideoIdFromUrl(videoUrl);
        return response;
    }

    async findVideo(videoId: string): Promise<VideoDetail> {
        const response = await this.youtubeClient.findVideo(videoId);
        return this.formatVideo(response);
    }

    async findPlaylistVideos(playlistID: string): Promise<VideoDetail[]> {
        const response = await this.youtubeClient.findPlaylistVideos(playlistID);
        return this.formatVideosInPlaylist(response);
    }

    private formatVideo(videoInfo: ytdl.videoInfo): VideoDetail {
        const thumbnail = videoInfo.videoDetails.thumbnail.thumbnails[0] ? videoInfo.videoDetails.thumbnail.thumbnails[0].url : ""
        return {
            id: videoInfo.videoDetails.videoId,
            thumbnail: thumbnail,
            title: videoInfo.videoDetails.title,
            sliceList: [
                {
                    name: 'Full video',
                    startTime: '00:00',
                    duration: videoInfo.videoDetails.lengthSeconds,
                    isFullContent: true
                }
            ]            
        }
    }

    private formatVideosInPlaylist(playlistDetails: ytpl.Result): VideoDetail[]{
        const videos: VideoDetail[] = [];
        playlistDetails.items.forEach((video) => {
            videos.push({
                id: video.id,
                title: video.title,
                thumbnail: video.bestThumbnail.url ? video.bestThumbnail.url : ""
            })
        });
        return videos;
    }
}