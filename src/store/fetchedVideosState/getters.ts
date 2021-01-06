import { GetterTree } from 'vuex';
import { FetchedVideosState } from './types';
import { RootState } from '../types';
import { ItemStruct } from '@/config/litterals';

export const getters: GetterTree<FetchedVideosState, RootState> = {
    getSelectedVideo(state): ItemStruct{
        return state.selectedVideo;
    },
    getFetchedVideos(state): ItemStruct[]{
        return state.fetchedVideos;
    }
};
