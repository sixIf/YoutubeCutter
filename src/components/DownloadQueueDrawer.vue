<template>
    <div class="flex-container" :style="`flex: 0 0 ${appBarHeight}; height: ${appBarHeight}`">
        <v-btn
            :class="`darkPrimary ${isDownloading ? 'bounce' : ''}`"
            color="white"
            dark
            icon
            id="download-queue"
            @click.stop="drawer = !drawer"
        >
            <v-icon>mdi-chevron-triple-left</v-icon>
        </v-btn>
        <v-navigation-drawer
            v-model="drawer"
            class="card"
            absolute
            right
            temporary
            width="800"
            style="z-index: 101"
        >
            <v-container fluid>
                <v-row>
                    <v-col cols="12" class="primary">
                        <h1 class="white--text" style="text-align: center">{{ $t('queue.title') }}</h1>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-list>
                            <queue-list-item 
                                headerIcon="mdi-download-circle-outline" 
                                :headerTitle="$t('queue.downloading')"
                                :items="downloadingItems"
                            >
                                <template v-slot:actionBtns>
                                    <v-progress-circular
                                        indeterminate
                                        color="primary"
                                    ></v-progress-circular>
                                </template>
                            </queue-list-item>
                            <queue-list-item 
                                headerIcon="mdi-clock-outline" 
                                :headerTitle="$t('queue.waiting')"
                                :items="inQueueItems"
                            >
                                <template v-slot:actionBtns="{ item, index }">
                                    <v-row>
                                        <v-col cols="6" v-if="index > 0">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="moveUp(item)">
                                                        <v-icon>mdi-chevron-up-circle</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('queue.moveUpTooltip') }}</span>
                                            </v-tooltip>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="removeQueuedItem(item)">
                                                        <v-icon>mdi-close-circle-outline</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('queue.removeQueueTooltip') }}</span>
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>
                                </template>                            
                            </queue-list-item>
                            <queue-list-item 
                                headerIcon="mdi-check-outline" 
                                :headerTitle="$t('queue.downloaded')"
                                :items="doneItems"
                            >
                                <template v-slot:actionBtns="{ item }">
                                    <v-row>
                                        <v-col cols="6" v-if="item.filePath">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="open(item.filePath)">
                                                        <v-icon>mdi-play-circle-outline</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('queue.playTooltip') }}</span>
                                            </v-tooltip>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="open(item.folderPath)">
                                                        <v-icon>mdi-folder</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('queue.folderTooltip') }}</span>
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>
                                </template>                                
                            </queue-list-item>
                            <queue-list-item 
                                v-if="!!errorItems.length"
                                headerIcon="mdi-alert-circle-outline" 
                                :headerTitle="$t('queue.error')"
                                :items="errorItems"
                            >
                                <template v-slot:actionBtns="{ item }">
                                    <v-row>
                                        <!-- <v-col cols="6">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="retryDownload(item)">
                                                        <v-icon>mdi-alert-circle-outline</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('queue.viewErrorTooltip') }}</span>
                                            </v-tooltip>
                                        </v-col> -->
                                        <v-col cols="6">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="retryDownload([item])">
                                                        <v-icon>mdi-sync</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('queue.retryTooltip') }}</span>
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>
                                </template>                                
                            </queue-list-item>
                        </v-list>
                    </v-col>
                </v-row>
            </v-container>
        </v-navigation-drawer>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { DownloadRequest, IAlert, VideoDetail } from "@/config/litterals";
import QueueListItem from "@/components/QueueListItem.vue"
import { Getter } from "vuex-class";
import { ItemsToQueue } from "@/store/downloadQueueState/types";
import { APP_BAR_HEIGHT } from "@/config/litterals/ui";
import { generateUniqueId } from "@/helpers/stringHelper";
const { myIpcRenderer } = window;

@Component({
    components: {
        QueueListItem
    }
})
export default class DownloadQueueDrawer extends Vue {
    @Getter("downloadQueueState/getInQueueItems")  inQueueItems!: VideoDetail[];
    @Getter("downloadQueueState/getDownloadingItems")  downloadingItems!: VideoDetail[];
    @Getter("downloadQueueState/getDoneItems")  doneItems!: VideoDetail[];
    @Getter("downloadQueueState/getErrorItems")  errorItems!: VideoDetail[];
    drawer = null;
    isDownloading = false;

    @Watch("downloadingItems", { deep: true})
    onDownloadingItemsChange(newVal: VideoDetail[]){
        this.isDownloading = newVal.length != 0 ? true : false;
    }

    open(path: string) {
        myIpcRenderer.send("open-shell", path);
    }

    async moveUp(item: VideoDetail){
        myIpcRenderer.invoke("move-up-item", item.id)
            .then(() => {
                this.$store.dispatch("downloadQueueState/prioritize", item.id)
            })
            .catch(() => {
                window.log.error(`The video ${item.id} not found in background Queue`);
            })
    }

    async removeQueuedItem(item: VideoDetail){
        myIpcRenderer.invoke("remove-item", item.id)
            .then(() => {
                this.$store.dispatch("downloadQueueState/removeFromQueue", item.id)
            })
            .catch(() => {
                window.log.error(`The video ${item.id} not found in background Queue`);
            })
    }

    retryDownload(item: VideoDetail[]){
        const downloadRequest: DownloadRequest = {
            requestId: generateUniqueId(),
            itemSelected: item,
            downloadFolder: item[0].folderPath,
        };

        const itemsToQueue: ItemsToQueue = { queue: "inQueue", items: item};
        this.$store.commit('downloadQueueState/setItemsInQueue', itemsToQueue);

        myIpcRenderer.send("download-videos", downloadRequest);  

        this.$store.dispatch('fetchedVideosState/resetVideosState');
        this.$router.push('/');
    }

    setAlert(type: string, message: string): void {
        const alert: IAlert = {
                type: type,
                message: message
        }
        this.$store.commit("uiState/setAlert", alert);
    }

    mounted() {
        myIpcRenderer.receive("start-download-item", (data: VideoDetail) => {
            const itemToQueue: ItemsToQueue = { queue: "downloading", items: [data] };
            this.$store.dispatch("downloadQueueState/changeItemList", itemToQueue);
        });

        myIpcRenderer.receive("item-downloaded", (data: VideoDetail) => {
            window.log.info(`Behold, video ${data.title} downloaded`);
            const itemToQueue: ItemsToQueue = { queue: "done", items: [data] };
            this.$store.dispatch("downloadQueueState/changeItemList", itemToQueue);
            this.setAlert("success", this.$t("queue.videoDownloaded", { video: data.title }) as string);
        });

        myIpcRenderer.receive(
            "download-error",
            (data: VideoDetail) => {
                window.log.info(`Download error ${data.title}`);

            const itemToQueue: ItemsToQueue = { queue: "errors", items: [data] };
            this.$store.dispatch("downloadQueueState/changeItemList", itemToQueue);
            this.setAlert("error", this.$t("queue.videoError", { video: data.title }) as string);
            }
        );
    }

    get appBarHeight(): string {
        return APP_BAR_HEIGHT;
    }    
}
</script>

<style lang="stylus">
#download-queue
  margin-right: 15px
  z-index 100
  background: #d32f2f

.flex-container
  display: flex
  justify-content: flex-end
  align-items: center

.bounce
  -webkit-animation bounce 1s infinite

    
</style>
<style>
@-webkit-keyframes bounce {
    0% {
        bottom: 5px;
    }
    25%,
    75% {
        bottom: 15px;
    }
    50% {
        bottom: 20px;
    }
    100% {
        bottom: 0;
    }
}
.v-navigation-drawer__content {
    overflow: hidden !important;
    height: 100vh;
}
</style>