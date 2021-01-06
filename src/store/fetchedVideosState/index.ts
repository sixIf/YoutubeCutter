import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { FetchedVideosState } from './types';
import { RootState } from '../types';

export const state: FetchedVideosState = {
      selectedVideo: {
        id: '',
        thumbnail: '',
        title: ''
      },
      fetchedVideos: []
};

const namespaced = true;

export const fetchedVideosState: Module<FetchedVideosState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
