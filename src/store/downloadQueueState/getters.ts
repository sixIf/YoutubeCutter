import { GetterTree } from 'vuex';
import { DownloadQueueState } from './types';
import { RootState } from '../types';

export const getters: GetterTree<DownloadQueueState, RootState> = {
    getBoardColumnSpan(state): number{
        return state.boardColumnSpan;
    },
    getDetailsFolded(state): boolean{
        return state.detailsFolded;
    },
    getFoldersFolded(state): boolean{
        return state.foldersFolded;
    },
    getShowFolderDetails(state): boolean{
        return state.showFolderDetails;
    },
    getVerticalLayout(state): boolean{
        return state.verticalLayout;
    },
};
