import { IYoutubeClient, ChannelFetched } from "@/api/youtubeClient";
import { injectable, inject } from "tsyringe";

export interface ChannelInfos {
  id: string;
  title: string;
  thumbnail: string;
}

export interface IYoutubeService {
  getVideoList(playlistId: string, pageToken: string): Promise<any>;
  findChannelById(channelId: string): Promise<any>;
  findMainPlaylist(channelId: string): Promise<any>;

  testApiKey(apiKeyToTest: string | null): Promise<any>;

  formatApiResponse(apiResponse: ChannelFetched): any;
}

@injectable()
export class YoutubeService implements IYoutubeService {

  // youtubeClient: IYoutubeClient;

  constructor(@inject("IYoutubeClient") private youtubeClient: IYoutubeClient) { }
  async testApiKey(apiKeyToTest: string | null): Promise<any> {
    const response = await this.youtubeClient.testApiKey(apiKeyToTest)
    return response;
  }

  formatApiResponse(apiResponse: ChannelFetched): any {
    console.log('FormatApiResponse')
    console.log(apiResponse)
  }

  getVideoList(playlistId: string, pageToken: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async findChannelById(channelId: string): Promise<any> {
    const response = await this.youtubeClient.findChannelById(channelId)
    return this.formatApiResponse(response)
  }

  findMainPlaylist(channelId: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

}