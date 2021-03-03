import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { FetchedVideosState } from './types';
import { RootState } from '../types';
import { DOWNLOAD_FORMATS } from '@/config/litterals';

export const getDefaultState = (): FetchedVideosState => {
	return {
	selectedVideo: {
		id: '',
		thumbnail: '',
		title: '',
		toDownload: false,
		sliceList: [],
		formats: []
		},
	fetchedVideos: [],
	currentFormat: DOWNLOAD_FORMATS[0]
};
}

const state = getDefaultState();

const namespaced = true;

export const fetchedVideosState: Module<FetchedVideosState, RootState> = {
	namespaced,
	state,
	getters,
	actions,
	mutations,
};
