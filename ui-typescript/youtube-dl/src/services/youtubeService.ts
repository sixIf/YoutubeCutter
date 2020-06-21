import { IYoutubeClient } from "@/api/youtubeClient";
import { injectable, inject } from "tsyringe";
import { ChannelInfos, ApiChannelInfos, TestApiKey, ApiChannelMainPlaylist, ApiChannelPlaylists, ChannelMainPlaylist, ApiVideoInPlaylist, ItemStruct, ItemFetched } from '@/config/litterals/index'

export interface IYoutubeService {
  getVideoList(playlistId: string, pageToken: string): Promise<ItemFetched>;
  findChannelById(channelId: string): Promise<ChannelInfos>;

  getChannelPlaylists(channelId: string, pageToken: string): Promise<ItemFetched>;

  testApiKey(apiKeyToTest: string | null): Promise<TestApiKey>;
  findChannelMainPlaylist(channelId: string): Promise<ChannelMainPlaylist>;

  formatVideoList(apiResponse: ApiVideoInPlaylist): ItemFetched;
  formatChannelInfos(apiResponse: ApiChannelInfos): ChannelInfos;
}

@injectable()
export class YoutubeService implements IYoutubeService {

  // youtubeClient: IYoutubeClient;

  constructor(@inject("IYoutubeClient") private youtubeClient: IYoutubeClient) { }
  async testApiKey(apiKeyToTest: string | null): Promise<TestApiKey> {
    const response = await this.youtubeClient.testApiKey(apiKeyToTest)
    return response;
  }

  formatPlaylistList(apiResponse: ApiChannelPlaylists): ItemFetched {
    const channelPlaylists: Array<ItemStruct> = [];
    apiResponse.data.items.forEach(playlist => {
      channelPlaylists.push({
        id: playlist.id,
        title: playlist.snippet.title,
        thumbnail: playlist.snippet.thumbnails.high.url
      });
    });
    const ItemFetched: ItemFetched = {
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
        thumbnail: video.snippet.thumbnails.high.url
      });
    });
    const ItemFetched: ItemFetched = {
      nextPageToken: apiResponse.data.nextPageToken,
      itemList: channelVideos
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
      thumbnail: apiResponse.data.items != undefined ? apiResponse.data.items[0].snippet.thumbnails.high.url : "not found",
      title: apiResponse.data.items != undefined ? apiResponse.data.items[0].snippet.title : "not found",
      mainPlaylistId: apiResponse.data.items != undefined ? apiResponse.data.items[0].contentDetails.relatedPlaylists.uploads : "not found",
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




  async getVideoList(playlistId: string, pageToken: string): Promise<ItemFetched> {
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