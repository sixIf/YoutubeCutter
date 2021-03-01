import { ActionTree } from 'vuex';
import { FetchedVideosState } from './types';
import { RootState } from '../types';

export const actions: ActionTree<FetchedVideosState, RootState> = {
    resetVideosState({ commit }){
        commit('resetState');
    },
    async createSlice({ commit }, slice): Promise<boolean>{
        return new Promise ((resolve, reject) => {
            try {
                commit('createSlice', slice);
                resolve(true)
            } catch (error) {
                reject(error)
            }
            
        })
    },
};
