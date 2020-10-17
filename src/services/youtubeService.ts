import { IYoutubeClient } from "@/api/youtubeClient";
import { injectable, inject } from "tsyringe";
import { ChannelInfos, ApiVideoById, ApiChannelInfos, TestApiKey, ApiChannelMainPlaylist, ApiChannelPlaylists, ChannelMainPlaylist, ApiVideoInPlaylist, ItemStruct, ItemFetched, VideoFetched, ApiYoutubeThumbnail } from '@/config/litterals/index'

export interface IYoutubeService {
    getVideoList(playlistId: string, pageToken: string): Promise<ItemFetched>;
    findChannelById(channelId: string): Promise<ChannelInfos>;

    extractVideoIdFromUrl(videoUrl: string): string;

    findVideoById(videoId: string): Promise<VideoFetched>;
    getChannelPlaylists(channelId: string, pageToken: string): Promise<ItemFetched>;

    testApiKey(apiKeyToTest: string | null): Promise<TestApiKey>;
    findChannelMainPlaylist(channelId: string): Promise<ChannelMainPlaylist>;

    findChannelByVideo(videoId: string): Promise<ChannelMainPlaylist>;

    formatVideo(apiResponse: ApiVideoById): VideoFetched;
    formatVideoList(apiResponse: ApiVideoInPlaylist): ItemFetched;
    formatChannelInfos(apiResponse: ApiChannelInfos): ChannelInfos;
}

@injectable()
export class YoutubeService implements IYoutubeService {


    constructor(@inject("IYoutubeClient") private youtubeClient: IYoutubeClient) { }
    async testApiKey(apiKeyToTest: string | null): Promise<TestApiKey> {
        const response = await this.youtubeClient.testApiKey(apiKeyToTest)
        return response;
    }

    computeThumbnail(thumbnail: ApiYoutubeThumbnail): string {
        if (thumbnail.standard)
            return thumbnail.standard.url;
        else if (thumbnail.high)
            return thumbnail.high.url;
        else if (thumbnail.medium)
            return thumbnail.medium.url;
        else if (thumbnail.default)
            return thumbnail.default.url;
        else
            return "";
    }

    formatPlaylistList(apiResponse: ApiChannelPlaylists): ItemFetched {
        const channelPlaylists: Array<ItemStruct> = [];
        apiResponse.data.items.forEach(playlist => {
            channelPlaylists.push({
                id: playlist.id,
                title: playlist.snippet.title,
                thumbnail: this.computeThumbnail(playlist.snippet.thumbnails)
            });
        });
        const ItemFetched: ItemFetched = {
            itemCount: apiResponse.data.pageInfo.totalResults,
            nextPageToken: apiResponse.data.nextPageToken,
            itemList: channelPlaylists
        }
        return ItemFetched;
    }

    formatVideoList(apiResponse: ApiVideoInPlaylist): ItemFetched {
        const channelVideos: Array<ItemStruct> = [];
        apiResponse.data.items.forEach(video => {
            channelVideos.push({
                id: video.snippet.resourceId.videoId,
                title: video.snippet.title,
                thumbnail: this.computeThumbnail(video.snippet.thumbnails)
            });
        });
        const ItemFetched: ItemFetched = {
            itemCount: apiResponse.data.pageInfo.totalResults,
            nextPageToken: apiResponse.data.nextPageToken,
            itemList: channelVideos
        }
        return ItemFetched;
    }

    formatVideo(apiResponse: ApiVideoById): VideoFetched {
        const ItemFetched: VideoFetched = {
            totalResults: apiResponse.data.pageInfo.totalResults,
            videoInfos: {
                id: apiResponse.data.items[0] ? apiResponse.data.items[0].id : "not found",
                thumbnail: apiResponse.data.items[0] ? this.computeThumbnail(apiResponse.data.items[0].snippet.thumbnails) : "not found",
                title: apiResponse.data.items[0] ? apiResponse.data.items[0].snippet.title : "not found"
            }
        }
        return ItemFetched;
    }

    async getChannelPlaylists(channelId: string, pageToken: string): Promise<ItemFetched> {
        const response = await this.youtubeClient.findChannelPlaylists(channelId, pageToken)
        return this.formatPlaylistList(response)
    }

    formatChannelInfos(apiResponse: ApiChannelInfos): ChannelInfos {
        const channelInfos: ChannelInfos = {
            id: apiResponse.data.items != undefined ? apiResponse.data.items[0].id : "not found",
            thumbnail: apiResponse.data.items != undefined ? this.computeThumbnail(apiResponse.data.items[0].snippet.thumbnails) : "not found",
            title: apiResponse.data.items != undefined ? apiResponse.data.items[0].snippet.title : "not found",
            mainPlaylistId: apiResponse.data.items != undefined ? apiResponse.data.items[0].contentDetails.relatedPlaylists.uploads : "not found",
            totalResults: apiResponse.data.pageInfo.totalResults
        };
        return channelInfos;
    }

    formatChannelMainPlaylist(apiResponse: ApiChannelMainPlaylist): ChannelMainPlaylist {
        const channelMainPlaylist: ChannelMainPlaylist = {
            id: apiResponse.data.items != undefined ? apiResponse.data.items[0].id : "not found",
            mainPlaylistId: apiResponse.data.items != undefined ? apiResponse.data.items[0].contentDetails.relatedPlaylists.uploads : "not found",
            channelTitle: apiResponse.data.items != undefined ? apiResponse.data.items[0].snippet.title : "not found",
            totalResults: apiResponse.data.pageInfo.totalResults
        };
        return channelMainPlaylist;
    }


    async findVideoById(videoId: string): Promise<VideoFetched> {
        const response = await this.youtubeClient.findVideoById(videoId)
        return this.formatVideo(response)
    }


    async getVideoList(playlistId: string, pageToken: string): Promise<ItemFetched> {
        const response = await this.youtubeClient.fetchVideoInPlaylist(playlistId, pageToken)
        return this.formatVideoList(response)
    }

    async findChannelByVideo(videoId: string): Promise<ChannelMainPlaylist> {
        const responseVideo = await this.youtubeClient.findVideoById(videoId);
        const channelId = responseVideo.data.items[0].snippet.channelId;
        const response = await this.youtubeClient.findChannelMainPlaylist(channelId)
        return this.formatChannelMainPlaylist(response)
    }
    async findChannelById(channelId: string): Promise<ChannelInfos> {
        const response = await this.youtubeClient.findChannelById(channelId)
        return this.formatChannelInfos(response)
    }

    async findChannelMainPlaylist(channelId: string): Promise<ChannelMainPlaylist> {
        const response = await this.youtubeClient.findChannelMainPlaylist(channelId)
        return this.formatChannelMainPlaylist(response)
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
            const indexOfList = videoUrl.indexOf("?list=");
            return videoUrl.slice(indexOfFormatted + "youtu.be/".length, indexOfList);
        } else {
            const indexOfSlash = videoUrl.lastIndexOf("/");
            return videoUrl.slice(indexOfSlash + 1);
        }
    }
}