import { ActionTree } from 'vuex';
import { FetchedVideosState } from './types';
import { RootState } from '../types';
import { ApplicationContainer } from '@/di';
import { YoutubeService } from '@/services/youtubeService';
import { SlicedYoutube, VideoDetail } from '@/config/litterals';

const youtubeService = ApplicationContainer.resolve(YoutubeService);

export const actions: ActionTree<FetchedVideosState, RootState> = {
    resetVideosState({ commit }){
        commit('resetState');
    },
    async createSlice({ commit }, slice: SlicedYoutube): Promise<boolean>{
        return new Promise ((resolve, reject) => {
            try {
                commit('createSlice', slice);
                resolve(true)
            } catch (error) {
                reject(error)
            }
            
        })
    },
    async setSelectedVideo({ commit }, video: VideoDetail){
        if (video.formats.length == 0) {
            try {
                console.log('on call')
                const videoWithFormats = await youtubeService.findVideo(video.id);
                commit('setVideoFormats', videoWithFormats);
                commit('setSelectedVideo', videoWithFormats);
            } catch (error) {
                window.log.error('error');
            }
        } else {
            commit('setSelectedVideo', video);
        }
    }
};
