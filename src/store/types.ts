import { FetchedVideosState } from "./fetchedVideosState/types";

export interface RootState {
    version: string;
    fetchedVideosState?: FetchedVideosState;
} 
  