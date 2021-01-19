<template>
        <v-container fluid>
            <v-row no-gutters fill-height align="start" justify="start">
                <v-col cols="6">
                    <v-card class="card" height="800">
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
                                        :hint="selectFormatHint"
                                        :label="selectFormatLabel"
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
import { Component, Inject, Vue, Watch } from "vue-property-decorator";
import { Getter } from 'vuex-class';
import { AvailableFormats, DownloadRequest, DOWNLOAD_FORMATS, PlayRequest, SliceToUpdate, VideoDetail, YOUTUBE_SERVICE } from '@/config/litterals';
import { IYoutubeService } from '@/services/youtubeService';
import YoutubePlayer from '@/components/YoutubePlayer.vue'
import VideosList from '@/components/VideosList.vue'
import SliceManager from '@/components/SliceManager.vue'
import _, { concat } from 'lodash';
import { generateUniqueId } from "@/helpers/stringHelper";
const { log, i18n, myIpcRenderer } = window;

// Define the component in class-style
@Component({
    components: {
        YoutubePlayer,
        VideosList,
        SliceManager
    }
})
export default class Home extends Vue {
    @Inject(YOUTUBE_SERVICE)
    youtubeService!: IYoutubeService;
    @Getter('fetchedVideosState/getFetchedVideos') videoList!: VideoDetail[];
    @Getter('fetchedVideosState/getSelectedVideo') selectedVideo!: VideoDetail;
    ytLink = "";
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
    }

    selectDownloadFolder() {
        window.myIpcRenderer.send("select-folder", {});
    }

    addVideoToList(video: VideoDetail){
        const videoIndexInList = _.findIndex(this.videoList, (value) => {
            return value.id == video.id
        })

        video.sliceList[0].format = this.selectedFormat;

        if (videoIndexInList == -1) {
            this.$store.commit('fetchedVideosState/setSingleFetchedVideo', video);
        }
    }

    getSelectText(format: AvailableFormats){
        return `${i18n.translate(format.type).concat(` (${format.value})`)}`
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
                const formattedYtLink = this.getFormattedUrl();
                const playlistId = await this.youtubeService.getPlaylistIdFromUrl(formattedYtLink);
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
     * Watchers
     */
    @Watch('selectedFormat')
    onSelectedFormatChange(newFormat: AvailableFormats){
        this.$store.commit('fetchedVideosState/setSelectedFormat', newFormat);
    }

    /**
     * Getters
     */

    // Ytpl struggle to decode channel url sometimes
    getFormattedUrl(): string {
        let formattedYtLink = this.ytLink.charAt(0) == 'y' ? 'https://www.'.concat(this.ytLink) : this.ytLink;
        const slashOccurrence = formattedYtLink.match(/\//g);
        if (slashOccurrence && slashOccurrence!.length > 4) formattedYtLink = formattedYtLink.slice(0, formattedYtLink.lastIndexOf('/'));
        return formattedYtLink;
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
