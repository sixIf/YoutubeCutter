<template>
    <v-form @submit.prevent="">
        <v-text-field 
            v-model="ytLink"
            :label="$t('download.textInputLabel')"
            :hint="hint"
            filled
            rounded
            dense
            class="card"
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
                            v-show="error.length != 0" 
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
import { DOWNLOAD_FORMATS, VideoDetail, YOUTUBE_SERVICE, AvailableFormats } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
import _ from "lodash";
import { LocaleMessage, LocaleMessages } from "vue-i18n";
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
    @Getter('fetchedVideosState/getFetchedVideos') videoList!: VideoDetail[];
    @Getter('fetchedVideosState/getSelectedVideo') selectedVideo!: VideoDetail;
    ytLink = "";
    isFetching = false;
    error = '';
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
        let errorThrown = false;
        this.error = '';
        if (!this.ytLink) return;
        try {
            this.isFetching = true;
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
                this.ytLink = "";
            } catch (err) {
                this.$emit("nothing-found");
                errorThrown = true;
                log.error(err);
            }
            
        } finally {
            this.isFetching = false;
            if (!errorThrown) this.$emit("videos-found");
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

    get displayError(): LocaleMessage {
        switch (this.error) {
            case 'id':
                return this.$t('error.linkNotFound');
        
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
    .error {
        background-color: var(--v-card-base);
        color: var(--v-lightPrimary-base);
    }

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