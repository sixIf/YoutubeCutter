<template>
    <video :id="playerID" controls width="100%" height="100%">
        <source :src="videoStream" type="video/mp4">
    </video>
</template>
    

<script lang="ts">
/* eslint-disable no-undef */
import { PlayRequest } from "@/config/litterals";
import { playerID } from "@/config/litterals/ui";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class YoutubePlayer extends Vue {
    @Prop({ default: "" }) videoId!: string;
    @Prop({ default: "" }) videoStream!: string;
    @Prop({ default: () => {
            return {
                start: 0,
                end: 0
            }
        }
    }) playRequest!: PlayRequest;
    player!: HTMLMediaElement;
    currentPlaybackTimeout!: NodeJS.Timeout;

    @Watch('videoStream')
    onVideoStreamChanged(){
        this.playVideo();
    }

    @Watch('playRequest', { deep: true })
    onPlayRequestChanged(newPlayRequest: PlayRequest){
        if ((newPlayRequest.start + newPlayRequest.end) != 0){
            const playDuration = newPlayRequest.end - newPlayRequest.start;
            this.playSpecificSlice(newPlayRequest.start, playDuration)
        }
    }

    playSpecificSlice(start: number, duration: number){
        this.clearCurrentTimeout();
        this.player.currentTime = start;
        this.player.play();
        this.currentPlaybackTimeout = setTimeout(() => {
            this.player.pause();
        }, duration * 1000)
    }

    clearCurrentTimeout(){
        if (this.currentPlaybackTimeout) clearTimeout(this.currentPlaybackTimeout);
    }

    mounted() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.player = document.getElementById(this.playerID)! as HTMLMediaElement;   
        this.playVideo();
    }

    playVideo(){
        this.player.load();
        if (this.videoStream) this.player.play();
    }

    get playerID(): string {
        return playerID;
    }

    get width(): number {
        switch (this.$vuetify.breakpoint.name) {
            case 'xl':
                
                return 620;
        
            default:
                return 560;
        }
    }

    get height(): number {
        switch (this.$vuetify.breakpoint.name) {
            case 'xl':
                
                return 348.75;
        
            default:
                return 315;
        }
    }
}
</script>
<style scoped>
    .yt-iframe {
        border: none;
    }
</style>