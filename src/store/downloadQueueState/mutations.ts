import { MutationTree } from 'vuex';
import { DownloadQueueState } from './types';

export const mutations: MutationTree<DownloadQueueState> = {
    setBoardColumnSpan(state, boardColumnSpan: number){
        state.boardColumnSpan = boardColumnSpan
    },
    setDetailsFolded(state, detailsFolded: boolean){
        state.detailsFolded = detailsFolded
    },
    setFoldersFolded(state, foldersFolded: boolean){
        state.foldersFolded = foldersFolded
    },
    setShowFolderDetails(state, showFolderDetails: boolean){
        state.showFolderDetails = showFolderDetails
    },
    setVerticalLayout(state, verticalLayout: boolean){
        state.verticalLayout = verticalLayout
    },
};
