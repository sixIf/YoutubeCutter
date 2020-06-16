/**
 * Constantes
 */

export const YOUTUBESERVICE = "youtubeService";
export const APIKEYSERVICE = "apiKeyService";

export const ERROR_TYPES: Record<string, string> = {
  403: 'Quota exceeded for your API key. Buy more credit on your google account or retry tomorrow.',
  400: 'Your API key is invalid. Please rectify it.'
}

export const API_KEY = 'AIzaSyDeSxTCCjIY0GQGLLFsw7aZeZqtdiSvznI'


export const LOCAL_STORAGE_KEY = "YoutubeApiKey"


/**
 * Interfaces
 */

export interface ItemStruct {
  readonly id: string;
  readonly title: string;
  readonly thumbnail: string;
}

export interface ChannelInfos {
  id: string;
  title: string;
  thumbnail: string;
  mainPlaylistId: string;
  totalResults: number;
}

export interface TestApiKey {
  kind: string;
}

export interface ChannelFetched {
  readonly data: {
    readonly pageInfo: {
      totalResults: number;
      resultsPerPage: number;
    };

    readonly items: [
      {
        readonly id: string;
        readonly snippet: {
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
        contentDetails: {
          relatedPlaylists: {
            likes: string;
            favorites: string;
            uploads: string;
            watchHistory: string;
            watchLater: string;
          };
        };
      }
    ];
  };
}