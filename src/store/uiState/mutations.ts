import { IAlert } from '@/config/litterals';
import { MutationTree } from 'vuex';
import { UiState } from './types';

export const mutations: MutationTree<UiState> = {
    setAlert(state, alert: IAlert){
        state.currentAlert = Object.assign({}, alert);
    }
};