import axios from 'axios'
import { IApiKeyService } from '@/services/apiKeyService'
import { injectable, inject } from "tsyringe";
import { ApiChannelInfos, ApiVideoById, TestApiKey, ApiChannelMainPlaylist, ApiVideoInPlaylist, ApiChannelPlaylists } from '@/config/litterals/index'

export interface IYoutubeClient {
  findVideo(videoUrl: string): Promise<any>;
  findPlaylist(playlistUrl: string): Promise<any>;
  findChannel(channelUrl: string): Promise<any>;

}

@injectable()
export class YoutubeClient implements IYoutubeClient {

  constructor(@inject("IApiKeyService") private apiKeyAccessor: IApiKeyService) { }
  async findVideo(videoUrl: string): Promise<any> {
    return window.myIpcRenderer.invoke("getVideoInfo", videoUrl);
  }

  findPlaylist(playlistUrl: string): Promise<any> {
    return window.myIpcRenderer.invoke("getPlaylist", playlistUrl);
  }

  findChannel(channelUrl: string): Promise<any> {
    throw window.myIpcRenderer.invoke("getPlaylist", channelUrl);
  }

}
