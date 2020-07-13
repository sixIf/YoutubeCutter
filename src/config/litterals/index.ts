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

export interface ItemFetched {
  readonly nextPageToken: string;
  readonly itemList: Array<ItemStruct>;
}

export interface VideoFetched {
  readonly totalResults: number;
  readonly videoInfos: ItemStruct;
}

export interface IAlert {
  type: string;
  message: string;
}

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

export interface VideoSelected {
  readonly id: string;
  readonly title: string;
}

export interface ApiVideoInPlaylist {
  readonly data: {
    readonly nextPageToken: string;
    readonly items: [
      {
        kind: string;
        snippet: {
          channelId: string;
          title: string;
          description: string;
          thumbnails: {
            high: {
              url: string;
              width: number;
              height: number;
            };
          };
          channelTitle: string;
          playlistId: string;
          position: number;
          resourceId: {
            kind: string;
            videoId: string;
          };
        };
      }
    ];
  };
}

export interface ApiVideoById {
  readonly data: {
    readonly pageInfo: {
      totalResults: number;
      resultsPerPage: number;
    };
    readonly items: [
      {
        kind: string;
        id: string;
        snippet: {
          channelId: string;
          title: string;
          description: string;
          thumbnails: {
            high: {
              url: string;
              width: number;
              height: number;
            };
          };
          channelTitle: string;
        };
      }
    ];
  };
}

export interface ApiChannelPlaylists {
  readonly data: {
    readonly nextPageToken: string;
    readonly items: [
      {
        kind: string;
        id: string;
        snippet: {
          channelId: string;
          title: string;
          thumbnails: {
            high: {
              url: string;
              width: number;
              height: number;
            };
          };
        };
      }
    ];
  };
}


export interface ApiChannelInfos {
  readonly data: {
    readonly pageInfo: {
      totalResults: number;
      resultsPerPage: number;
    };

    readonly items: [
      {
        readonly id: string;
        readonly contentDetails: {
          relatedPlaylists: {
            likes: string;
            favorites: string;
            uploads: string;
          };
        };
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
      }
    ];
  };
}

export interface ApiChannelMainPlaylist {
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
        };
        contentDetails: {
          relatedPlaylists: {
            likes: string;
            favorites: string;
            uploads: string;
          };
        };
      }
    ];
  };
}

export interface ChannelMainPlaylist {
  readonly id: string;
  readonly totalResults: number;
  readonly mainPlaylistId: string;
  readonly channelTitle: string;
}