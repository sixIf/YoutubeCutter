import { IYoutubeClient } from "@/api/youtubeClient";
import { ItemStruct } from "@/config/litterals";
import { injectable, inject } from "tsyringe";
import ytdl from "ytdl-core";

export interface IYoutubeService {
    findVideo(videoId: string): Promise<ItemStruct>;
    findPlaylist(playlistUrl: string): Promise<any>;
    findChannel(channelUrl: string): Promise<any>;
    getVideoIdFromUrl(videoUrl: string): Promise<string>;
}

@injectable()
export class YoutubeService implements IYoutubeService {


    constructor(@inject("IYoutubeClient") private youtubeClient: IYoutubeClient) { }
    async getVideoIdFromUrl(videoUrl: string): Promise<string> {
        const response = await this.youtubeClient.getVideoIdFromUrl(videoUrl);
        return response;
    }

    async findVideo(videoId: string): Promise<ItemStruct> {
        const response = await this.youtubeClient.findVideo(videoId);
        return this.formatVideo(response);
    }

    findPlaylist(playlistUrl: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    findChannel(channelUrl: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    private formatVideo(videoInfo: ytdl.videoInfo): ItemStruct {
        return {
            id: videoInfo.videoDetails.videoId,
            thumbnail: videoInfo.thumbnail_url,
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
}