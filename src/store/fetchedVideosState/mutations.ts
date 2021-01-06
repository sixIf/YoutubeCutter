import { ItemStruct } from '@/config/litterals';
import { MutationTree } from 'vuex';
import { FetchedVideosState } from './types';
import _ from "lodash"

export const mutations: MutationTree<FetchedVideosState> = {
    setSelectedVideo(state, selectedVideo: ItemStruct){
        state.selectedVideo = selectedVideo
    },
    setFetchedVideos(state, fetchedVideos: ItemStruct[]){
        state.fetchedVideos = _.cloneDeep(fetchedVideos);
    }
};
