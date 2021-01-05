<template>
    <v-container>
        <v-row justify="center">
            <youtube-player 
                :videoId="videoId"
                @player-paused="updateCurrentTime"/>
        </v-row>
        <v-row justify="center">
            <slice-manager :currentTime="currentTime"/>
        </v-row>
    </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import { YOUTUBE_SERVICE } from '@/config/litterals';
import { Component, Inject, Vue } from "vue-property-decorator";
import YoutubePlayer from "@/components/YoutubePlayer.vue"
import SliceManager from "@/components/SliceManager.vue"
import { YoutubeService } from '@/services/youtubeService';
import ytdl from "ytdl-core";
const { log } = window;

// Define the component in class-style
@Component({
    components: {
        YoutubePlayer,
        SliceManager
    }
})
export default class VideoEditor extends Vue {
    @Inject(YOUTUBE_SERVICE)
    youtubeService!: YoutubeService;
    videoInfo: ytdl.videoInfo | null = null;
    currentTime = 0;

    updateCurrentTime(currentTime: number) {
        this.currentTime = currentTime;
    }

    async getVideoInfo(){
        try {
            const videoInfo = await this.youtubeService.findVideo(this.videoId);
            this.videoInfo = videoInfo;
        } catch (err) {
            log.error(err);
        }
    }
    
    get videoId() {
        return this.$route.params.id;
    }

    mounted() {
        this.getVideoInfo();
    }
}
</script>