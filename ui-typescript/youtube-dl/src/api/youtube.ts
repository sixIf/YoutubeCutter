import axios from 'axios'

export interface IYoutubeService {

  fetchVideoInPlaylist(apiKey: string, playlistId: string, pageToken: string): Promise<any>;
  findChannelById(apiKey: string, channelId: string): Promise<any>;
  test(): void;

}

export class YoutubeService implements IYoutubeService {

  fetchVideoInPlaylist(apiKey: string, playlistId: string, pageToken: string) {
    console.log('fetchVideoInPlaylist')
    return axios
      .get(
        "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&order=date&maxResults=25",
        {
          params: {
            playlistId: playlistId,
            key: apiKey,
            pageToken: pageToken
          }
        }
      )
  }

  findChannelById(apiKey: string, channelId: string) {
    console.log('findChannelById')
    return axios
      .get(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&maxResults=1",
        {
          params: {
            id: channelId,
            key: apiKey
          }
        }
      )
  }
  test() {
    console.log('test')
  }
}
