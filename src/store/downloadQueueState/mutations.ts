import { VideoDetail } from '@/config/litterals';
import _ from 'lodash';
import { MutationTree } from 'vuex';
import { DownloadQueueState, ItemsToQueue, QueueLists } from './types';

export const mutations: MutationTree<DownloadQueueState> = {
    setItemsInQueue(state, itemToQueue: ItemsToQueue){
        itemToQueue.items.forEach(item => {
            state[itemToQueue.queue].push(Object.assign({}, item));   
        });
    },
    removeItemsToQueue(state, itemToQueue: ItemsToQueue){
        itemToQueue.items.forEach(item => {
            const index = _.findIndex(state[itemToQueue.queue], (value: VideoDetail) => {
                return value.id == item.id;
            });
            if(index != -1) state[itemToQueue.queue].splice(index, 1);
        });
    },
    clearQueue(state, queue: QueueLists){
        state[queue] = [];
    },
    prioritizeItem(state, itemId: string){
        const index = _.findIndex(state.inQueue, (value: VideoDetail) => {
            return value.id == itemId;
        });
        if (index != -1) {
            const elem = state.inQueue.splice(index, 1)[0];
            state.inQueue.unshift(elem);
        }
    },
    removeItem(state, itemId: string){
        const index = _.findIndex(state.inQueue, (value: VideoDetail) => {
            return value.id == itemId;
        });
        if (index != -1) state.inQueue.splice(index, 1)[0];
    }
};
