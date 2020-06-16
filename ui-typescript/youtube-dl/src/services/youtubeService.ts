import { IYoutubeClient } from "@/api/youtubeClient";
import { injectable, inject } from "tsyringe";
import { ChannelInfos, ChannelFetched, TestApiKey } from '@/config/litterals/index'

export interface IYoutubeService {
  getVideoList(playlistId: string, pageToken: string): Promise<any>;
  findChannelById(channelId: string): Promise<ChannelInfos>;
  findMainPlaylist(channelId: string): Promise<any>;

  testApiKey(apiKeyToTest: string | null): Promise<TestApiKey>;

  formatApiResponse(apiResponse: ChannelFetched): any;
  formatChannelInfos(apiResponse: ChannelFetched): ChannelInfos;
}

@injectable()
export class YoutubeService implements IYoutubeService {

  // youtubeClient: IYoutubeClient;

  constructor(@inject("IYoutubeClient") private youtubeClient: IYoutubeClient) { }
  async testApiKey(apiKeyToTest: string | null): Promise<TestApiKey> {
    const response = await this.youtubeClient.testApiKey(apiKeyToTest)
    return response;
  }

  formatApiResponse(apiResponse: ChannelFetched): any {
    console.log('FormatApiResponse')
    apiResponse.data.items.forEach(video => {
      this.videoList.push({
        id: video.snippet.resourceId.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url
      });
    });
    console.log(apiResponse)
  }

  formatChannelInfos(apiResponse: ChannelFetched): ChannelInfos {
    console.log('formatChannelInfos')
    console.log(apiResponse)
    const channelInfos: ChannelInfos = {
      id: apiResponse.data.items != undefined ? apiResponse.data.items[0].id : "not found",
      thumbnail: apiResponse.data.items != undefined ? apiResponse.data.items[0].snippet.thumbnails.high.url : "not found",
      title: apiResponse.data.items != undefined ? apiResponse.data.items[0].snippet.channelTitle : "not found",
      mainPlaylistId: apiResponse.data.items != undefined ? apiResponse.data.items[0].contentDetails.relatedPlaylists.uploads : "not found",
      totalResults: apiResponse.data.pageInfo.totalResults
    };
    return channelInfos;
  }

  getVideoList(playlistId: string, pageToken: string): Promise<any> {
    throw this.formatApiResponse(response)
  }

  async findChannelById(channelId: string): Promise<ChannelInfos> {
    const response = await this.youtubeClient.findChannelById(channelId)
    return this.formatChannelInfos(response)
  }

  findMainPlaylist(channelId: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

}