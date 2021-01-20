<template>
    <v-form @submit.prevent=""
        ref="form"
        v-model="valid"
    >
        <v-text-field 
            v-model="ytLink"
            :label="$t('download.textInputLabel')"
            :hint="hint"
            filled
            rounded
            dense
            class="card"
            required
            :rules="linkRules"
            @input="debouncedSearch"
            @contextmenu="openTextFieldMenu"
        >
            <template v-slot:append>
                <v-progress-circular
                    v-if="isFetching"
                    indeterminate
                    color="primary"
                ></v-progress-circular>
            </template>
        </v-text-field>  
    </v-form>  
</template>

<script lang="ts">
import { DOWNLOAD_FORMATS, VideoDetail, YOUTUBE_SERVICE, AvailableFormats } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
import _ from "lodash";
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
    valid = true;
    linkRules = [
        (link: string) => link && this.error !== 'id' || 'The id is required'
    ];
    error = '';
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
                log.error(err);
            }
            
        } finally {
            this.isFetching = false;
            this.error = 'id';
            this.form.validate();
            this.$emit("videos-found")
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

    get hint(){
        return "https://www.youtube.com/watch?v=jNQXAC9IVRw";
    }

    get form(): Vue & { validate: () => boolean } {
        return this.$refs.form as Vue & { validate: () => boolean };
    }
}
</script>