<template>
    <v-row align="center" justify="center" style="height: 100%">
        <v-col cols="6" xl="5" align-self="stretch">
            <div class="flex-column-wrap" style="height: 100%">
                <!-- Search card -->
                <v-card class="darkPrimary mb-3" elevation="8" style="flex: 0 0 150px;">
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <search-youtube-text-field 
                                    :selectedFormat="selectedFormat"
                                    :inputTitle="$t('search.addYoutubeLink')"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
                <!-- Video list Card -->
                <v-card class="grayTwo mb-3" style="flex: 1 0 auto;">
                    <videos-list :videoList="videoList"></videos-list>
                </v-card>
                <!-- Download Options Card -->
                <v-card class="grayOne" elevation="8" style="flex: 0 0 150px;">
                    <v-container>
                        <v-row justify="center" align="center">
                            <v-col cols="6">
                                <v-text-field
                                    v-model="downloadFolder"
                                    :label="$t('download.folder')"
                                    filled
                                    dense
                                    color="grayOne"
                                    background-color="grayTwo"                                    
                                    readonly
                                    @click="selectDownloadFolder"    
                                ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-select
                                    v-model="selectedFormat"
                                    :items="availableFormats"
                                    filled
                                    dense
                                    color="grayOne"
                                    background-color="grayTwo"
                                    :label="$t('format.format')"
                                    return-object
                                >
                                    <template v-slot:selection="{item}">
                                        {{ getSelectText(item) }}
                                    </template>
                                    <template v-slot:item="{item}">
                                        {{ getSelectText(item) }}
                                    </template>
                                </v-select>
                            </v-col>
                        </v-row>
                        <v-row no-gutters justify="center" align="center">
                            <v-col cols="12" style="text-align: center;">
                                <v-btn
                                    color="primary"
                                    @click="downloadItems"
                                    :disabled="isDownloadDisbled"
                                >{{ $tc('download.button', videosToDownload.length, { nb: videosToDownload.length }) }}</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </div>
        </v-col>
        <v-col cols="6" xl="5" align-self="stretch">
            <div class="flex-column-wrap" style="height: 100%">
                <v-card color="black" style="flex: 0 0 250px; height: 250px">
                    <youtube-player 
                        :videoId="currentVideoId"
                        :videoStream="videoStream"
                        :playRequest="playRequest"
                    ></youtube-player>
                </v-card>
                <v-card class="lightPrimary" style="flex: 1 0 auto;" :disabled="!videoStream">
                    <slice-manager @play-slice="updatePlayRequest"/>
                </v-card>
            </div>
        </v-col>
    </v-row>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue, Watch } from "vue-property-decorator";
import { Getter } from 'vuex-class';
import { AvailableFormats, DownloadRequest, DOWNLOAD_FORMATS, PlayRequest, VideoDetail } from '@/config/litterals';
import YoutubePlayer from '@/components/YoutubePlayer.vue'
import VideosList from '@/components/VideosList.vue'
import SliceManager from '@/components/SliceManager.vue'
import SearchYoutubeTextField from '@/components/SearchYoutubeTextField.vue'
import _ from 'lodash';
import { generateUniqueId } from "@/helpers/stringHelper";
import { ItemsToQueue } from "@/store/downloadQueueState/types";
const { log, myIpcRenderer } = window;

// Define the component in class-style
@Component({
    components: {
        YoutubePlayer,
        VideosList,
        SliceManager,
        SearchYoutubeTextField,
    }
})
export default class VideosManager extends Vue {
    @Getter('fetchedVideosState/getFetchedVideos') videoList!: VideoDetail[]    
    @Getter('fetchedVideosState/getSelectedVideo') selectedVideo!: VideoDetail;
    downloadFolder = "";
    selectedFormat = DOWNLOAD_FORMATS[0];
    playRequest: PlayRequest = {
        start: 0,
        end: 0
    };

    updatePlayRequest(playRequest: PlayRequest){
        this.playRequest = Object.assign({}, playRequest);
    }

    downloadItems(){
        const downloadRequest: DownloadRequest = {
            requestId: generateUniqueId(),
            itemSelected: this.videosToDownload,
            downloadFolder: this.downloadFolder,
        };

        const itemsToQueue: ItemsToQueue = { queue: "inQueue", items: this.videosToDownload};
        this.$store.commit('downloadQueueState/setItemsInQueue', itemsToQueue);

        myIpcRenderer.send("download-videos", downloadRequest);  

        this.$store.dispatch('fetchedVideosState/resetVideosState');
        this.$router.push('/');
    }

    selectDownloadFolder() {
        window.myIpcRenderer.send("select-folder", {});
    }


    getSelectText(format: AvailableFormats){
        return `${this.$t('format.'.concat(format.type))} (${format.value})`
    }

    mounted() {
        window.myIpcRenderer.receive(
            "selected-folder",
            (data: string[] | undefined) => {
                if (data) {
                    this.downloadFolder = data[0];
                }
            }
        );

        window.myIpcRenderer.invoke("get-default-download-folder", {})
            .then((folder) => {
                this.downloadFolder = folder;
            })
            .catch((err) => {
                log.error(err);
            })
    }

    /**
     * Watchers
     */
    @Watch('selectedFormat')
    onSelectedFormatChange(newFormat: AvailableFormats){
        this.$store.commit('fetchedVideosState/setSelectedFormat', newFormat);
    }

    /**
     * Getters
     */

    get videoStream() {
        const bestFormat = _.filter(this.selectedVideo.formats, (format) => {
            return (format.hasVideo && format.hasAudio);
        })
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return bestFormat.length != 0 ? bestFormat[0]!.url : "";
    }
    
    get videosToDownload(): VideoDetail[] {
        return _.filter(this.videoList, (video) => video.toDownload)
    }


    get availableFormats(){
        return DOWNLOAD_FORMATS;
    }


    get isDownloadDisbled(){
        return this.downloadFolder && this.videosToDownload.length != 0 ? false : true;
    }

    get currentVideoId(){
        return this.selectedVideo.id;
    }

    get hint(){
        return "https://www.youtube.com/watch?v=jNQXAC9IVRw";
    } 
}
</script>
