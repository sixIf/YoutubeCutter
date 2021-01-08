<template>
        <v-container fluid>
            <v-row no-gutters fill-height align="start" justify="start">
                <v-col cols="6">
                    <v-card class="card">
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-form @submit.prevent="searchItem">
                                        <v-text-field 
                                            v-model="ytLink"
                                            :label="textLabel"
                                            :hint="hint"
                                            filled
                                            rounded
                                            dense
                                            class="card"
                                            required
                                            append-outer-icon="mdi-send"
                                            @click:append-outer="searchItem" 
                                        ></v-text-field>
                                    </v-form>
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
                                        :label="selectFolderLabel"
                                        :hint="selectFolderHint"
                                        persistent-hint
                                        
                                        @click="selectDownloadFolder"    
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-select
                                        v-model="selectedFormat"
                                        :items="availableFormats"
                                        item-text="text"
                                        :hint="selectFormatHint"
                                        :label="selectFormatLabel"
                                        return-object
                                        persistent-hint
                                    ></v-select>
                                </v-col>
                                <v-col cols="4" align-self="center">
                                    <v-btn
                                        color="primary"
                                        @click="downloadItems"
                                    >{{ downloadButtonLabel }}</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-col>
                <v-col cols="6" v-if="selectedVideo.id">
                    <v-container no-gutters fluid>
                        <v-row justify="center">
                            <youtube-player 
                                :videoId="currentVideoId"
                                @player-paused="updateCurrentTime"
                            ></youtube-player>
                            <v-col cols="12">
                                <!-- Slice manager -->
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Inject, Vue } from "vue-property-decorator";
import { Getter } from 'vuex-class';
import { DownloadRequest, DOWNLOAD_FORMATS, VideoDetail, YOUTUBE_SERVICE } from '@/config/litterals';
import { IYoutubeService } from '@/services/youtubeService';
import YoutubePlayer from '@/components/YoutubePlayer.vue'
import VideosList from '@/components/VideosList.vue'
import _ from 'lodash';
import { generateUniqueId } from "@/helpers/stringHelper";
const { log, i18n, myIpcRenderer } = window;

// Define the component in class-style
@Component({
    components: {
        YoutubePlayer,
        VideosList
    }
})
export default class Home extends Vue {
    @Inject(YOUTUBE_SERVICE)
    youtubeService!: IYoutubeService;
    @Getter('fetchedVideosState/getFetchedVideos') videoList!: VideoDetail[];
    @Getter('fetchedVideosState/getSelectedVideo') selectedVideo!: VideoDetail;
    ytLink = "";
    downloadFolder = "";
    selectedFormat = this.availableFormats[0];
    currentTime = 0;

    updateCurrentTime(currentTime: number) {
        this.currentTime = currentTime;
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
    }

    selectDownloadFolder() {
        window.myIpcRenderer.send("select-folder", {});
    }

    addVideoToList(video: VideoDetail){
        const videoIndexInList = _.findIndex(this.videoList, (value) => {
            return value.id == video.id
        })

        if (videoIndexInList == -1) {
            this.$store.commit('fetchedVideosState/setSingleFetchedVideo', video);
        }
    }

    /**
     * search order : Video - Playlist / Channel
     */
    async searchItem(){
        try {
            const videoId = await this.youtubeService.getVideoIdFromUrl(this.ytLink);
            const videoFound = await this.youtubeService.findVideo(videoId);
            this.addVideoToList(videoFound);
            this.ytLink = "";
        } catch (err) {
            log.error(err);
            try {
                log.info('On cherche playlist')
                const playlistId = await this.youtubeService.getPlaylistIdFromUrl(this.ytLink);
                log.info(`playlistID: ${playlistId}`)
                const videoInPlaylist = await this.youtubeService.findPlaylistVideos(playlistId);
                videoInPlaylist.forEach((video) => this.addVideoToList(video));
            } catch (err) {
                log.error(err);
            }
            
        } finally {
            this.ytLink = "";
        }
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
    }
    
    /**
     * Getters
     */

    get videosToDownload(): VideoDetail[] {
        return _.filter(this.videoList, (video) => video.toDownload)
    }

    get availableFormats(){
        return DOWNLOAD_FORMATS.map((format) => {
            return {
                text: `${i18n.translate(format.type).concat(` (${format.value})`)}`,
                value: format.value
            }
        });
    }

    get currentVideoId(){
        return this.selectedVideo.id;
    }
    
    get textLabel(){
        return `${i18n.translate("Video, Playlist or channel URL")}`
    }

    get hint(){
        return "https://www.youtube.com/watch?v=jNQXAC9IVRw";
    }

    get selectFormatHint(){
        return `Choose the format for the download`;
    }

    get selectFormatLabel(){
        return i18n.translate('Format');
    }

    get selectFolderHint(){
        return `Choose where to save the download`;
    }

    get selectFolderLabel(){
        return i18n.translate('Download Folder');
    }

    get downloadButtonLabel(){
        return i18n.translate('Download.button');
    }    
}
</script>
<style>
.clickable {
    cursor: pointer;
}
</style>
