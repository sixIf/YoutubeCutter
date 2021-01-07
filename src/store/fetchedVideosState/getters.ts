import { GetterTree } from 'vuex';
import { FetchedVideosState } from './types';
import { RootState } from '../types';
import { VideoDetail } from '@/config/litterals';

export const getters: GetterTree<FetchedVideosState, RootState> = {
    getSelectedVideo(state): VideoDetail{
        return state.selectedVideo;
    },
    getFetchedVideos(state): VideoDetail[]{
        return state.fetchedVideos;
    }
};
