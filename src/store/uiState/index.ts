import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { UiState } from './types';
import { RootState } from '../types';

export const getDefaultState = (): UiState => {
    return {
        currentAlert: {
            message: "",
            type: ""
        }
    }
}

const state = getDefaultState();

const namespaced = true;

export const uiState: Module<UiState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
