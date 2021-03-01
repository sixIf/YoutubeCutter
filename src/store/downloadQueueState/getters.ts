import { GetterTree } from 'vuex';
import { DownloadQueueState } from './types';
import { RootState } from '../types';
import { VideoDetail } from '@/config/litterals';

export const getters: GetterTree<DownloadQueueState, RootState> = {
    getDoneItems(state): VideoDetail[]{
        return state.done;
    },
    getDownloadingItems(state): VideoDetail[]{
        return state.downloading;
    },
    getErrorItems(state): VideoDetail[]{
        return state.errors;
    },
    getInQueueItems(state): VideoDetail[]{
        return state.inQueue;
    },
};
