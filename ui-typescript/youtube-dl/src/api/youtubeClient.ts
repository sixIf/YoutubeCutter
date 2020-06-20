import axios from 'axios'
import { IApiKeyService } from '@/services/apiKeyService'
import { injectable, inject } from "tsyringe";
import { ApiChannelInfos, TestApiKey, ApiChannelMainPlaylist, ApiVideoInPlaylist, ApiChannelPlaylists } from '@/config/litterals/index'

export interface IYoutubeClient {

  findChannelById(channelId: string): Promise<ApiChannelInfos>;
  findChannelPlaylists(channelId: string, pageToken: string): Promise<ApiChannelPlaylists>;
  findChannelMainPlaylist(channelId: string): Promise<ApiChannelMainPlaylist>;
  fetchVideoInPlaylist(playlistId: string, pageToken: string): Promise<ApiVideoInPlaylist>;
  testApiKey(apiKeyToTest: string | null): Promise<TestApiKey>;
}

@injectable()
export class YoutubeClient implements IYoutubeClient {

  constructor(@inject("IApiKeyService") private apiKeyAccessor: IApiKeyService) { }
  findChannelPlaylists(channelId: string, pageToken: string): Promise<ApiChannelPlaylists> {
    return axios
      .get(
        "https://www.googleapis.com/youtube/v3/playlists?part=snippet&order=date&maxResults=50",
        {
          params: {
            channelId: channelId,
            key: this.apiKey,
            pageToken: pageToken
          }
        }
      )
  }
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
  fetchVideoInPlaylist(playlistId: string, pageToken: string): Promise<ApiVideoInPlaylist> {
    return axios
      .get(
        "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&order=date&maxResults=50",
        {
          params: {
            playlistId: playlistId,
            key: this.apiKey,
            pageToken: pageToken
          }
        }
      )
  }

  findChannelById(channelId: string): Promise<ApiChannelInfos> {
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

  findChannelMainPlaylist(channelId: string): Promise<ApiChannelMainPlaylist> {
    return axios
      .get(
        "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&maxResults=1",
        {
          params: {
            id: channelId,
            key: this.apiKey
          }
        }
      )
  }
}
