import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { DownloadQueueState } from './types';
import { RootState } from '../types';

export const state: DownloadQueueState = {
      boardColumnSpan: 0,
      detailsFolded: false,
      foldersFolded: false,
      showFolderDetails: false,
      verticalLayout: false,
};

const namespaced = true;

export const downloadQueueState: Module<DownloadQueueState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
