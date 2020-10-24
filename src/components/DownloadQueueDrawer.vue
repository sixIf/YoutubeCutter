<template>
    <div>
        <v-btn
            :class="isDownloading ? 'bounce' : ''"
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
            absolute
            right
            temporary
            width="500"
            style="z-index: 101"
        >
            <v-list-item style="position: sticky">
                <v-list-item-content>
                    <v-tabs
                        v-model="tab"
                        background-color="transparent"
                        color="basil"
                        grow
                    >
                        <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
                    </v-tabs>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-tabs-items v-model="tab">
                <queue-list-item
                    :isDownloading="true"
                    :videos="videoDownloading"
                />
                <queue-list-item
                    :isDownloading="false"
                    :videos="videoDownloaded"
                    @clear="clearDownloadedList()"
                />
            </v-tabs-items>
        </v-navigation-drawer>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as _ from "lodash";
import {
    YOUTUBE_SERVICE,
    ItemStruct,
    ItemDownloading,
    ERROR_TYPES,
} from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
const { myIpcRenderer } = window;
import QueueListItem from "@/components/QueueListItem.vue";

@Component({
    components: {
        QueueListItem,
    },
})
export default class DownloadQueueDrawer extends Vue {
    dialog = false;
    drawer = null;
    tab = null;
    tabs = ["Downloading", "Finished"];
    videoDownloading: Array<ItemDownloading> = [];
    videoDownloaded: Array<ItemDownloading> = [];
    isDownloading = false;

    clearDownloadedList() {
        this.videoDownloaded = _.cloneDeep([]);
    }

    open(path: string) {
        window.myIpcRenderer.send("open-shell", path);
    }

    mounted() {
        window.myIpcRenderer.receive(
            "download-progress",
            (data: ItemDownloading) => {
                this.isDownloading = true;
                const index = this.videoDownloading.findIndex(
                    (x) => x.video.id === data.video.id
                );
                if (index == -1) this.videoDownloading.push(data);
                else {
                    if (data.type == "audio")
                        this.videoDownloading[index].progressAudio =
                            data.progressAudio;
                    else
                        this.videoDownloading[index].progressVideo =
                            data.progressVideo;
                }
            }
        );

        window.myIpcRenderer.receive("item-downloaded", (data: ItemStruct) => {
            this.isDownloading = false;
            const indexToDelete = _.findIndex(this.videoDownloading, function (
                x
            ) {
                return x.video.id === data.id;
            });
            if (indexToDelete != -1) {
                this.videoDownloaded.push(
                    _.cloneDeep(this.videoDownloading[indexToDelete])
                );
                _.remove(this.videoDownloading, function (
                    value: ItemDownloading,
                    index: number
                ) {
                    return index == indexToDelete;
                });
                console.log(`Behold, video ${data.title} downloaded`);
            } else {
                this.videoDownloaded.push({
                    video: data,
                    progressAudio: "100",
                    progressVideo: "100",
                    type: "video",
                    audioOnly: false,
                });
            }
        });

        window.myIpcRenderer.receive("download-error", (data: ItemStruct) => {
            this.isDownloading = false;
            const indexToDelete = _.findIndex(this.videoDownloading, function (
                x
            ) {
                return x.video.id === data.id;
            });
            if (indexToDelete != -1) {
                this.videoDownloaded.push(
                    _.cloneDeep(this.videoDownloading[indexToDelete])
                );
                _.remove(this.videoDownloading, function (
                    value: ItemDownloading,
                    index: number
                ) {
                    return index == indexToDelete;
                });
                console.log(`Error downloading video ${data.title}`);
            }
        });
    }
}
</script>

<style lang="stylus">
#download-queue
  position fixed
  z-index 100
  bottom 8px
  right  5px
  background: #d32f2f

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