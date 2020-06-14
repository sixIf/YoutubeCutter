export const YOUTUBESERVICE = "youtubeService";
export const APIKEYSERVICE = "apiKeyService";

export const ERROR_TYPES: Record<string, string> = {
  403: 'Quota exceeded for your API key. Buy more credit on your google account or retry tomorrow.',
  400: 'Your API key is invalid. Please rectify it.'
}

export const API_KEY = 'AIzaSyDeSxTCCjIY0GQGLLFsw7aZeZqtdiSvznI'

export interface ItemStruct {
  readonly id: string;
  readonly title: string;
  readonly thumbnail: string;
}

export const LOCAL_STORAGE_KEY = "YoutubeApiKey"

