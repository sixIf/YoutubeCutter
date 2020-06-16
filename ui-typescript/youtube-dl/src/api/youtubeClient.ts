import axios from 'axios'
import { IApiKeyService } from '@/services/apiKeyService'
import { injectable, inject } from "tsyringe";
import { ChannelFetched, TestApiKey } from '@/config/litterals/index'

export interface IYoutubeClient {

  fetchVideoInPlaylist(playlistId: string, pageToken: string): Promise<any>;
  findChannelById(channelId: string): Promise<ChannelFetched>;
  testApiKey(apiKeyToTest: string | null): Promise<TestApiKey>;
}

@injectable()
export class YoutubeClient implements IYoutubeClient {

  constructor(@inject("IApiKeyService") private apiKeyAccessor: IApiKeyService) { }
  testApiKey(apiKeyToTest: string | null): Promise<TestApiKey> {
    return axios
      .get(
        "https://www.googleapis.com/youtube/v3/videos?part=id&id=jNQXAC9IVRw&id=YXGXESqHkAI",
        {
          params: {
            key: apiKeyToTest
          }
        }
      )
  }

  get apiKey(): string | null {
    return this.apiKeyAccessor.getApiKey()
  }

  // Don't return promise but return video formatted
  fetchVideoInPlaylist(playlistId: string, pageToken: string) {
    console.log('fetchVideoInPlaylist')
    return axios
      .get(
        "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&order=date&maxResults=25",
        {
          params: {
            playlistId: playlistId,
            key: this.apiKey,
            pageToken: pageToken
          }
        }
      )
  }

  findChannelById(channelId: string): Promise<ChannelFetched> {
    return axios
      .get(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&part=contentDetails&maxResults=1",
        {
          params: {
            id: channelId,
            key: this.apiKey
          }
        }
      )
  }
}
