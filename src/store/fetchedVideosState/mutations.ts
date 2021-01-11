import { AvailableFormats, VideoDetail } from '@/config/litterals';
import { MutationTree } from 'vuex';
import { FetchedVideosState } from './types';
import _ from "lodash"
import { getDefaultState } from './index';

export const mutations: MutationTree<FetchedVideosState> = {
    setSelectedVideo(state, selectedVideo: VideoDetail){
        state.selectedVideo = selectedVideo
    },
    setFetchedVideos(state, fetchedVideos: VideoDetail[]){
        state.fetchedVideos = _.cloneDeep(fetchedVideos);
    },
    setSingleFetchedVideo(state, fetchedVideos: VideoDetail){
        state.fetchedVideos.push(fetchedVideos);
    },
    setSelectedFormat(state, format: AvailableFormats){
        state.fetchedVideos.forEach((video) => {
            video.sliceList[0].format = format;
        })
    },
    changeVideoToDownload(state, videoId: string){
        const videoIndex = _.findIndex(state.fetchedVideos, (video) => video.id == videoId);
        state.fetchedVideos[videoIndex].toDownload = !state.fetchedVideos[videoIndex].toDownload;
    },
    resetState(state){
        Object.assign(state, getDefaultState());
    }
};
