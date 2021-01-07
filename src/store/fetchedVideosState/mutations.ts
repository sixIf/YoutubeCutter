import { VideoDetail } from '@/config/litterals';
import { MutationTree } from 'vuex';
import { FetchedVideosState } from './types';
import _ from "lodash"

export const mutations: MutationTree<FetchedVideosState> = {
    setSelectedVideo(state, selectedVideo: VideoDetail){
        state.selectedVideo = selectedVideo
    },
    setFetchedVideos(state, fetchedVideos: VideoDetail[]){
        state.fetchedVideos = _.cloneDeep(fetchedVideos);
    },
    setSingleFetchedVideo(state, fetchedVideos: VideoDetail){
        state.fetchedVideos.push(fetchedVideos);
    }
};
