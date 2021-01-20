import { injectable } from "tsyringe";
import ytdl from 'ytdl-core';
import ytpl from 'ytpl'

export interface IYoutubeClient {
  findVideo(videoId: string): Promise<ytdl.videoInfo>;
  findPlaylistVideos(playlistID: string): Promise<ytpl.Result>;
  getVideoIdFromUrl(videoUrl: string): Promise<string>;
  getPlaylistIdFromUrl(playlistUrl: string): Promise<string>;
}

@injectable()
export class YoutubeClient implements IYoutubeClient {
  
  getVideoIdFromUrl(videoUrl: string): Promise<string> {
    return window.myIpcRenderer.invoke("get-video-id-from-url", videoUrl);
  }
  
  async getPlaylistIdFromUrl(playlistUrl: string): Promise<string> {
    return window.myIpcRenderer.invoke("get-playlist-id-from-url", playlistUrl);
  }

  async findVideo(videoId: string): Promise<ytdl.videoInfo> {
    return window.myIpcRenderer.invoke("get-video-infos", videoId);
  }

  async findPlaylistVideos(playlistID: string): Promise<ytpl.Result> {
    return window.myIpcRenderer.invoke("get-playlist-videos", playlistID);
  }
}
