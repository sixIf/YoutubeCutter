import { ActionTree } from 'vuex';
import { DownloadQueueState, ItemsToQueue } from './types';
import { RootState } from '../types';

export const actions: ActionTree<DownloadQueueState, RootState> = {
    prioritize({ commit }, itemId: string){
        commit('prioritizeItem', itemId);
    },
    changeItemList({ commit }, itemToQueue: ItemsToQueue){
        let oldQueueList: ItemsToQueue;
        switch (itemToQueue.queue) {
            case "downloading":
                oldQueueList = { queue: "inQueue" ,items: itemToQueue.items};
                commit('removeItemsToQueue', oldQueueList);
                break;
        
            default:
                oldQueueList = { queue: "downloading" ,items: itemToQueue.items}
                commit('removeItemsToQueue', oldQueueList);
                break;
        }
        commit('setItemsInQueue', itemToQueue);
    },
    
};
