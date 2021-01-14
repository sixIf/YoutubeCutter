import { AvailableFormats, SlicedYoutube, SliceToUpdate, VideoDetail } from '@/config/litterals';
import { MutationTree } from 'vuex';
import { FetchedVideosState } from './types';
import _ from "lodash"
import { getDefaultState } from './index';

export const mutations: MutationTree<FetchedVideosState> = {
    createSlice(state, newSlice: SlicedYoutube){
        const sliceToAdd = Object.assign({}, newSlice);
        state.selectedVideo.sliceList.push(sliceToAdd);
    },
    deleteSlice(state, indexToRemove: number){
        state.selectedVideo.sliceList.splice(indexToRemove, 1);
        if (state.selectedVideo.sliceList.length == 1 && !state.selectedVideo.sliceList[0].isActive)
            state.selectedVideo.toDownload = false;
        else state.selectedVideo.toDownload = true;
    },
    resetState(state){
        Object.assign(state, getDefaultState());
    },
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
        if (state.fetchedVideos[videoIndex].sliceList.length == 1)
            state.fetchedVideos[videoIndex].sliceList[0].isActive = state.fetchedVideos[videoIndex].toDownload;
    },
    setSlice(state, sliceToUpdate: SliceToUpdate){
        Object.assign(state.selectedVideo.sliceList[sliceToUpdate.index], sliceToUpdate.updatedSlice);
        if (state.selectedVideo.sliceList.length == 1 && !state.selectedVideo.sliceList[0].isActive)
            state.selectedVideo.toDownload = false;
        else state.selectedVideo.toDownload = true;
    }
};
