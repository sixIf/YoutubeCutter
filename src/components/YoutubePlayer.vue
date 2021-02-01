<template>
    <div id="player"></div>
</template>
    

<script lang="ts">
/* eslint-disable no-undef */
import { PlayRequest } from "@/config/litterals";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class YoutubePlayer extends Vue {
    @Prop({ default: "" }) videoId!: string;
    @Prop({ default: () => {
            return {
                start: 0,
                end: 0
            }
        }
    }) playRequest!: PlayRequest;
    player!: YT.Player;
    currentTime = 0;
    currentPlaybackTimeout!: NodeJS.Timeout;

    @Watch('videoId')
    onVideoIdChanged(newId: string){
        console.log(`video id changed ${this.player && newId}`)
        if (this.player && newId) {
            this.player.loadVideoById(newId);
            this.clearCurrentTimeout();
        }
        else this.initPlayer();
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
        this.player.seekTo(start, true);
        this.player.playVideo();
        this.currentPlaybackTimeout = setTimeout(() => {
            this.player.pauseVideo();
        }, duration * 1000)
    }

    clearCurrentTimeout(){
        if (this.currentPlaybackTimeout) clearTimeout(this.currentPlaybackTimeout);
    }

    createPlayer() {
        this.player = new YT.Player("player", {
            height: "300",
            width: "550",
            videoId: this.videoId,
            playerVars: {
                origin: "localhost", // TODO
                autoplay: 1
            }
        });
    }

    initPlayer() {
        window.onYouTubeIframeAPIReady = () => {
            this.createPlayer();
        };

        if(document.getElementById('iframe-api')) this.createPlayer();
        else {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            tag.id = "iframe-api"
            const firstScriptTag = document.getElementsByTagName("script")[0];
            if (firstScriptTag.parentNode)
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }

    mounted() {
        this.initPlayer();
        setInterval(() => {
            if (this.player && this.player.getPlayerState() == YT.PlayerState.PAUSED)
                this.currentTime = this.player.getCurrentTime();
        }, 300)
    }

    @Watch('currentTime')
    onCurrentTimeChange(newVal: number, oldVal: number){
        if (oldVal != newVal)
            this.$emit("time-changed", this.currentTime);
    }
}
</script>