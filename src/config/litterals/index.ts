/**
 * Constantes
 */

export const YOUTUBESERVICE = "youtubeService";
export const APIKEYSERVICE = "apiKeyService";

export const ERROR_TYPES: Record<string, string> = {
  403: 'Quota exceeded for your API key. Buy more credit on your google account or retry tomorrow.',
  404: 'Item not found, verify the pasted link.',
  400: 'Your API key is invalid. Please rectify it.'
}

export const API_KEY = 'AIzaSyDeSxTCCjIY0GQGLLFsw7aZeZqtdiSvznI'


export const LOCAL_STORAGE_KEY = "YoutubeApiKey"

/**
 * Interfaces
 */

export interface DownloadRequest {
  readonly audioOnly: boolean;
  readonly channelTitle: string;
  readonly playlistTitle: string;
  readonly itemSelected: Array<ItemStruct>;
}

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

export interface ItemDownloading {
  progressAudio: string;
  progressVideo: string;
  readonly type: string;
  readonly audioOnly: boolean;
  readonly video: ItemStruct;
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

export interface ApiYoutubeThumbnail {
  default: {
    url: string;
    width: number;
    height: number;
  };
  medium?: {
    url: string;
    width: number;
    height: number;
  };
  high?: {
    url: string;
    width: number;
    height: number;
  };
  standard?: {
    url: string;
    width: number;
    height: number;
  };
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
          thumbnails: ApiYoutubeThumbnail;
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
          thumbnails: ApiYoutubeThumbnail;
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
          thumbnails: ApiYoutubeThumbnail;
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
          thumbnails: ApiYoutubeThumbnail;
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