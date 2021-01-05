import { injectable } from "tsyringe";
import ytdl from 'ytdl-core';

export interface IYoutubeClient {
  findVideo(videoId: string): Promise<ytdl.videoInfo>;
  findPlaylist(playlistUrl: string): Promise<any>;
  findChannel(channelUrl: string): Promise<any>;
  getVideoIdFromUrl(videoUrl: string): Promise<string>;
}

@injectable()
export class YoutubeClient implements IYoutubeClient {

  getVideoIdFromUrl(videoUrl: string): Promise<string> {
    return window.myIpcRenderer.invoke("getVideoIdFromUrl", videoUrl);
  }

  async findVideo(videoId: string): Promise<ytdl.videoInfo> {
    return window.myIpcRenderer.invoke("getVideoInfo", videoId);
  }

  findPlaylist(playlistUrl: string): Promise<any> {
    return window.myIpcRenderer.invoke("getPlaylist", playlistUrl);
  }

  findChannel(channelUrl: string): Promise<any> {
    throw window.myIpcRenderer.invoke("getPlaylist", channelUrl);
  }

}
