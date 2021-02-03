<template>
    <v-container v-if="videoList.length != 0" fluid>
        <v-row no-gutters fill-height align="start" justify="start">
            <v-col cols="6">
                <v-card class="card" height="800">
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <search-youtube-text-field :selectedFormat="selectedFormat"/>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <videos-list :videoList="videoList"></videos-list>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="4">
                                <v-text-field
                                    v-model="downloadFolder"
                                    :label="$t('download.folder')"
                                    :hint="$t('download.folderHint')"
                                    persistent-hint
                                    readonly
                                    @click="selectDownloadFolder"    
                                ></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-select
                                    v-model="selectedFormat"
                                    :items="availableFormats"
                                    :hint="$t('format.selectHint')"
                                    :label="$t('format.format')"
                                    return-object
                                    persistent-hint
                                >
                                    <template v-slot:selection="{item}">
                                        {{ getSelectText(item) }}
                                    </template>
                                    <template v-slot:item="{item}">
                                        {{ getSelectText(item) }}
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="4" align-self="center">
                                <v-btn
                                    color="primary"
                                    @click="downloadItems"
                                    :disabled="isDownloadDisbled"
                                >{{ $t('download.button') }}</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
            <v-col cols="6" v-if="currentVideoId">
                <v-container no-gutters fluid>
                    <v-row justify="center">
                        <youtube-player 
                            :videoId="currentVideoId"
                            :playRequest="playRequest"
                            @time-changed="updateCurrentTime"
                        ></youtube-player>
                        <v-col cols="12">
                            <slice-manager :currentTime="currentTime" @play-slice="updatePlayRequest"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
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
    currentTime = 0;
    playRequest: PlayRequest = {
        start: 0,
        end: 0
    };

    updateCurrentTime(currentTime: number) {
        this.currentTime = currentTime;
    }

    updatePlayRequest(playRequest: PlayRequest){
        this.playRequest = Object.assign({}, playRequest);
    }

    downloadItems(){
        const downloadRequest: DownloadRequest = {
            requestId: generateUniqueId(),
            audioOnly: false,
            itemSelected: this.videosToDownload,
            downloadFolder: this.downloadFolder,
        };

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