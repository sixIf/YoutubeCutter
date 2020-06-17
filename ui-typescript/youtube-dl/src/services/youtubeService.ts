import { IYoutubeClient } from "@/api/youtubeClient";
import { injectable, inject } from "tsyringe";
import { ChannelInfos, ApiChannelFetched, TestApiKey, ApiChannelMainPlaylist, ChannelMainPlaylist, ApiVideoInPlaylist, ItemStruct, VideoFetched } from '@/config/litterals/index'

export interface IYoutubeService {
  getVideoList(playlistId: string, pageToken: string): Promise<VideoFetched>;
  findChannelById(channelId: string): Promise<ChannelInfos>;

  testApiKey(apiKeyToTest: string | null): Promise<TestApiKey>;
  findChannelMainPlaylist(channelId: string): Promise<ChannelMainPlaylist>;

  formatVideoList(apiResponse: ApiVideoInPlaylist): VideoFetched;
  formatChannelInfos(apiResponse: ApiChannelFetched): ChannelInfos;
}

@injectable()
export class YoutubeService implements IYoutubeService {

  // youtubeClient: IYoutubeClient;

  constructor(@inject("IYoutubeClient") private youtubeClient: IYoutubeClient) { }
  async testApiKey(apiKeyToTest: string | null): Promise<TestApiKey> {
    const response = await this.youtubeClient.testApiKey(apiKeyToTest)
    return response;
  }

  formatVideoList(apiResponse: ApiVideoInPlaylist): VideoFetched {
    console.log('formatVideoList')
    const channelVideos: Array<ItemStruct> = [];
    apiResponse.data.items.forEach(video => {
      channelVideos.push({
        id: video.snippet.resourceId.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url
      });
    });
    const VideoFetched: VideoFetched = {
      nextPageToken: apiResponse.data.nextPageToken,
      videoList: channelVideos
    }
    return VideoFetched;
  }

  formatChannelInfos(apiResponse: ApiChannelFetched): ChannelInfos {
    console.log('formatChannelInfos')
    console.log(apiResponse)
    const channelInfos: ChannelInfos = {
      id: apiResponse.data.items != undefined ? apiResponse.data.items[0].id : "not found",
      thumbnail: apiResponse.data.items != undefined ? apiResponse.data.items[0].snippet.thumbnails.high.url : "not found",
      title: apiResponse.data.items != undefined ? apiResponse.data.items[0].snippet.title : "not found",
      totalResults: apiResponse.data.pageInfo.totalResults
    };
    return channelInfos;
  }

  formatChannelMainPlaylist(apiResponse: ApiChannelMainPlaylist): ChannelMainPlaylist {
    const channelMainPlaylist: ChannelMainPlaylist = {
      mainPlaylistId: apiResponse.data.items != undefined ? apiResponse.data.items[0].contentDetails.relatedPlaylists.uploads : "not found",
      totalResults: apiResponse.data.pageInfo.totalResults
    };
    return channelMainPlaylist;
  }




  async getVideoList(playlistId: string, pageToken: string): Promise<VideoFetched> {
    const response = await this.youtubeClient.fetchVideoInPlaylist(playlistId, pageToken)
    return this.formatVideoList(response)
  }

  async findChannelById(channelId: string): Promise<ChannelInfos> {
    const response = await this.youtubeClient.findChannelById(channelId)
    return this.formatChannelInfos(response)
  }

  async findChannelMainPlaylist(channelId: string): Promise<ChannelMainPlaylist> {
    const response = await this.youtubeClient.findChannelMainPlaylist(channelId)
    return this.formatChannelMainPlaylist(response)
  }

}