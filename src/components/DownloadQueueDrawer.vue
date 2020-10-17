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
            <v-list-item style="position=sticky">
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
            <!-- TODO merge 2 tabs in a component -->
            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <v-list
                        v-for="infos in videoDownloading"
                        :key="infos.video.id"
                    >
                        <v-list-item>
                            <template v-slot:default>
                                <v-list-item-content>
                                    <v-list-item-title>{{
                                        infos.video.title
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle
                                        style="padding-left: 10px"
                                        >1. Downloading audio
                                        {{
                                            infos.progressAudio
                                        }}%</v-list-item-subtitle
                                    >
                                    <div v-if="!infos.audioOnly">
                                        <v-list-item-subtitle
                                            style="padding-left: 10px"
                                            >2. Downloading video
                                            {{
                                                infos.progressVideo
                                            }}%</v-list-item-subtitle
                                        >
                                    </div>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-progress-circular
                                        indeterminate
                                        color="primary"
                                    />
                                </v-list-item-action>
                            </template>
                        </v-list-item>
                        <v-divider></v-divider>
                    </v-list>
                </v-tab-item>
                <v-tab-item>
                    <v-btn
                        v-if="videoDownloaded.length != 0"
                        style="margin: 20px"
                        @click="clearDownloadedList"
                        >Clear list</v-btn
                    >
                    <v-list
                        v-for="infos in videoDownloaded"
                        :key="infos.video.id"
                    >
                        <v-list-item>
                            <template v-slot:default>
                                <v-list-item-content>
                                    <v-list-item-title>{{
                                        infos.video.title
                                    }}</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon
                                        @click="open(infos.video.folderPath)"
                                        >mdi-folder
                                    </v-icon>
                                    <v-icon @click="open(infos.video.filePath)"
                                        >mdi-play
                                    </v-icon>
                                </v-list-item-icon>
                            </template>
                        </v-list-item>
                        <v-divider></v-divider>
                    </v-list>
                </v-tab-item>
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

@Component
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
                console.log("Update progress");
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
                console.log(`Behold, video with id ${data} downloaded`);
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
                console.log(`Error downloading video with id ${data}`);
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
</style>