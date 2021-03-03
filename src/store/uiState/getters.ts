import { GetterTree } from 'vuex';
import { UiState } from './types';
import { RootState } from '../types';
import { IAlert } from '@/config/litterals';

export const getters: GetterTree<UiState, RootState> = {
    getAlert(state): IAlert {
        return state.currentAlert;
    },
};
