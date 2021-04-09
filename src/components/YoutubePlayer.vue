<template>
    <div class="player" style="width: 100%; height: 100%">
        <video :id="playerID" controls width="100%" height="100%">
            <source :src="videoStream" type="video/mp4">
        </video>
        <div class="controls">
            <v-btn class="sub-five-seconds" aria-label="rewind five second" @click="seek(-5)">-5s</v-btn>
            <v-btn class="add-five-seconds" aria-label="fast forward five second" @click="seek(5)">+5s</v-btn>
        </div>
    </div>
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

    seek(numberToAdd: number) {
        this.player.currentTime += numberToAdd;
    }

    mounted() {
        this.player = document.getElementById(this.playerID) as HTMLMediaElement;
        this.playVideo();
    }

    playVideo(){
        this.clearCurrentTimeout();
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
    .controls {
        opacity: 0;
        width: 400px;
        position: absolute;
        bottom: 60px;
        left: 50%;
        margin-left: -200px;
        transition: 1s all;
        display: flex;
    }    

    .add-five-seconds{
        margin-left: 250px;
    }

    .player:hover .controls, player:focus .controls {
    opacity: 1;
    }

</style>