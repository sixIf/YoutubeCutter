import { IYoutubeClient } from "@/api/youtubeClient";
import { injectable, inject } from "tsyringe";
import ytdl from "ytdl-core";

export interface IYoutubeService {
    findVideo(videoId: string): Promise<ytdl.videoInfo>;
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

    async findVideo(videoId: string): Promise<ytdl.videoInfo> {
        const response = await this.youtubeClient.findVideo(videoId);
        return response;
    }

    findPlaylist(playlistUrl: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    findChannel(channelUrl: string): Promise<any> {
        throw new Error("Method not implemented.");
    }



    /**
    * Extract video ID from URL
    * https://www.youtube.com/watch?v=MItG5VNI0Uk
    * https://www.youtube.com/watch?v=MItG5VNI0Uk&playlist=fafafaa
    * https://youtu.be/eak2dTkR3Ck?list=PLMBTl5yXyrGQfhjt0Efk3LWo7cmxk41n9
    */
    extractVideoIdFromUrl(videoUrl: string): string {
        if (videoUrl.indexOf("?v=") != -1) {
            const indexOfId = videoUrl.indexOf("?v=") != -1 ? videoUrl.indexOf("?v=") + "?v=".length : -1;
            const indexOfAmp = videoUrl.indexOf("&");
            if (indexOfAmp != -1) return videoUrl.slice(indexOfId, indexOfAmp);
            else return videoUrl.slice(indexOfId);
        } else if (videoUrl.indexOf("youtu.be/") != -1) {
            const indexOfFormatted = videoUrl.indexOf("youtu.be/");
            const indexOfParmameters = videoUrl.indexOf("?");
            return videoUrl.slice(indexOfFormatted + "youtu.be/".length, indexOfParmameters != -1 ? indexOfParmameters : videoUrl.length);
        } else {
            const indexOfSlash = videoUrl.lastIndexOf("/");
            return videoUrl.slice(indexOfSlash + 1);
        }
    }
}