import { GetterTree } from 'vuex';
import { FetchedVideosState } from './types';
import { RootState } from '../types';
import { AvailableFormats, VideoDetail } from '@/config/litterals';

export const getters: GetterTree<FetchedVideosState, RootState> = {
    getSelectedVideo(state): VideoDetail{
        return state.selectedVideo;
    },
    getFetchedVideos(state): VideoDetail[]{
        return state.fetchedVideos;
    },
    getSelectedFormat(state): AvailableFormats{
        return state.currentFormat;
    }
};
