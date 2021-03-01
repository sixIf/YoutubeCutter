import Vue from "vue";
import Vuex from "vuex";
import { RootState } from "./types";
import { fetchedVideosState } from './fetchedVideosState/index';
import { downloadQueueState } from './downloadQueueState/index';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
	state: {
	version: "1.0.0", // a simple property
	},
	modules: {
		fetchedVideosState,
		downloadQueueState
	}
});
