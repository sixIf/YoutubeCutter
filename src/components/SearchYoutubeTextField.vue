<template>
    <v-form @submit.prevent="">
        <h1 class="grayTwo--text pb-5">{{ inputTitle }}</h1>
        <v-text-field 
            v-model="ytLink"
            :label="$t('download.textInputLabel')"
            filled
            rounded
            dense
            color="grayOne"
            background-color="grayTwo"
            required
            @input="debouncedSearch"
            @contextmenu="openTextFieldMenu"
        >
            <template v-slot:append>
                <v-progress-circular
                    v-show="isFetching"
                    indeterminate
                    color="primary"
                ></v-progress-circular>
                <v-tooltip v-model="show" bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            class="vibrate"
                            v-bind="attrs"
                            v-on="on"
                            v-show="errorThrown" 
                        >
                            <v-icon class="primary--text">
                                mdi-alert-circle
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>{{ displayError }}</span>
                </v-tooltip>
            </template>
        </v-text-field>  
    </v-form>  
</template>

<script lang="ts">
import { DOWNLOAD_FORMATS, VideoDetail, YOUTUBE_SERVICE, AvailableFormats, IAlert } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
import _ from "lodash";
import { LocaleMessage } from "vue-i18n";
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
const { log, myIpcRenderer } = window;

@Component
export default class SearchYoutubeTextField extends Vue {
    @Inject(YOUTUBE_SERVICE)
    youtubeService!: IYoutubeService;
    @Prop({ 
        default: () => {
            return DOWNLOAD_FORMATS[0]
    }}) selectedFormat !: AvailableFormats;
    @Prop({default: ""}) inputTitle !: string;
    @Getter('fetchedVideosState/getFetchedVideos') videoList!: VideoDetail[];
    @Getter('fetchedVideosState/getSelectedVideo') selectedVideo!: VideoDetail;
    ytLink = "";
    isFetching = false;
    errorThrown = false;
    show = false;
    debouncedSearch = _.debounce(this.searchItem, 900);

    addVideoToList(video: VideoDetail){
        const videoIndexInList = _.findIndex(this.videoList, (value) => {
            return value.id == video.id
        })
        video.sliceList[0].format = this.selectedFormat;

        if (videoIndexInList == -1) {
            this.$store.commit('fetchedVideosState/setSingleFetchedVideo', video);
        }
    }

    openTextFieldMenu(){
        myIpcRenderer.send("open-context-menu", "text-field");
    }    

    /**
     * search order : Video - Playlist / Channel
     */
    async searchItem(){
        this.errorThrown = false;
        let videoNb = 0;
        if (!this.ytLink) return;
        try {
            this.isFetching = true;
            const videoId = await this.youtubeService.getVideoIdFromUrl(this.ytLink);
            const videoFound = await this.youtubeService.findVideo(videoId);
            videoNb = 1;
            this.addVideoToList(videoFound);
            this.ytLink = "";
        } catch (err) {
            log.error(err);
            try {
                const formattedYtLink = this.getFormattedUrl();
                const playlistId = await this.youtubeService.getPlaylistIdFromUrl(formattedYtLink);
                const videoInPlaylist = await this.youtubeService.findPlaylistVideos(playlistId);
                videoNb = videoInPlaylist.length;
                videoInPlaylist.forEach((video) => this.addVideoToList(video));
                this.ytLink = "";
            } catch (err) {
                this.$emit("nothing-found");
                this.errorThrown = true;
                log.error(err);
            }
            
        } finally {
            this.isFetching = false;
            let alert: IAlert;
            if (!this.errorThrown) {
                alert = {
                    type: "info",
                    message: this.$tc("search.info", videoNb, { nb: videoNb })
                }
                this.$emit("videos-found");
            } else {
                alert = {
                    type: "error",
                    message: this.$tc("search.error")
                }
            }
            this.$store.commit("uiState/setAlert", alert);
        }
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

    // TODO Proper error info
    get displayError(): LocaleMessage {
        switch (this.errorThrown) {
            default:
                return this.$t('error.linkNotFound');
        }
    }

    get hint(){
        return "https://www.youtube.com/watch?v=jNQXAC9IVRw";
    }
}
</script>

<style scoped>
    .vibrate {
        animation: 0.5s linear 0s 2 normal custombounce;
    }

    @keyframes custombounce {
        0% {
            transform: translateX(0px);
        }
        50% {
            transform: translateX(5px);
        }
        100% {
            transform: translateX(0px);
        }
    }    
</style>