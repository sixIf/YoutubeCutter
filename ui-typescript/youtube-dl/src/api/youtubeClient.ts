import axios from 'axios'
import { IApiKeyService } from '@/services/apiKeyService'
import { injectable, inject } from "tsyringe";

export interface IYoutubeClient {

  fetchVideoInPlaylist(playlistId: string, pageToken: string): Promise<any>;
  findChannelById(channelId: string): Promise<ChannelFetched>;
  findMainPlaylist(channelId: string): Promise<any>;
  testApiKey(apiKeyToTest: string | null): Promise<any>;
}
// interface YoutubePlaylistItems {

//   readonly snippet: {
//     channelId: string,
//     title: string,
//     description: string,
//     thumbnails: {
//       high: {
//         url: string
//       },
//     },
//     channelTitle: string,
//     playlistId: string,
//     resourceId: {
//       kind: string,
//       videoId: string
//     }
//   }
// }

export interface ChannelFetched {
  readonly pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  readonly snippet: {
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
    playlistId: string;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
}


@injectable()
export class YoutubeClient implements IYoutubeClient {


  /**
   * 
   * Ok soit je formatte dans une fonction a part soit je trouve un moyen pour quela methode fetchvideoinplaylist renvoi pas une promise mais le truc formatter
   * du coup si je fais ça comment je gère les erreurs ? voir avec schroter
   */
  // formatVideoResponse(apiResponse: YoutubePlaylistItems[]): YoutubePlaylistItemsFormatted[] {
  //   let apiResponseFormatted: YoutubePlaylistItemsFormatted[] = []
  //   apiResponse.forEach(video => {
  //     apiResponseFormatted.push({
  //       id: video.snippet.resourceId.videoId,
  //       title: video.snippet.title,
  //       thumbnail: video.snippet.thumbnails.high.url
  //     });
  //   });
  //   return apiResponseFormatted
  // }
  // API_KEY: string | null

  constructor(@inject("IApiKeyService") private apiKeyAccessor: IApiKeyService) { }
  testApiKey(apiKeyToTest: string | null): Promise<any> {
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

  findMainPlaylist(channelId: string) {
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


  findChannelById(channelId: string): Promise<ChannelFetched> {
    return axios
      .get(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&maxResults=1",
        {
          params: {
            id: channelId,
            key: this.apiKey
          }
        }
      )
  }
}
