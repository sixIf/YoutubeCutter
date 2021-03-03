import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { DownloadQueueState } from './types';
import { RootState } from '../types';

export const getDefaultState = (): DownloadQueueState => {
    return {
		done: [],
		downloading: [],
		errors: [],
		inQueue: []
    }
};

const state = getDefaultState();
const namespaced = true;

export const downloadQueueState: Module<DownloadQueueState, RootState> = {
	namespaced,
	state,
	getters,
	actions,
	mutations,
};
