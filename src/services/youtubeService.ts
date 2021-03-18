import { IYoutubeClient } from "@/api/youtubeClient";
import { DOWNLOAD_FORMATS, VideoDetail } from "@/config/litterals";
import { toInteger } from "lodash";
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
        const thumbnail = videoInfo.videoDetails.thumbnails[0] ? videoInfo.videoDetails.thumbnails[0].url : ""
        return {
            id: videoInfo.videoDetails.videoId,
            title: videoInfo.videoDetails.title,
            thumbnail: thumbnail,
            toDownload: true,
            folderPath: "",
            
            sliceList: [
                {
                    name: videoInfo.videoDetails.title,
                    startTime: 0,
                    endTime: toInteger(videoInfo.videoDetails.lengthSeconds),
                    isActive: true,
                    format: DOWNLOAD_FORMATS[0]
                }
            ],
            formats: videoInfo.formats            
        }
    }

    private formatVideosInPlaylist(playlistDetails: ytpl.Result): VideoDetail[]{
        const videos: VideoDetail[] = [];
        playlistDetails.items.forEach((video) => {
            videos.push({
                id: video.id,
                title: video.title,
                thumbnail: video.bestThumbnail.url ? video.bestThumbnail.url : "",
                toDownload: true,
                folderPath: "",
                sliceList: [
                    {
                        name: video.title,
                        startTime: 0,
                        endTime: video.durationSec ? video.durationSec : 0,
                        isActive: true,
                        format: DOWNLOAD_FORMATS[0]
                    }
                ],
                formats: []     
            })
        });
        return videos;
    }
}