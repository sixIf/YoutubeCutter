<template>
    <div id="player"></div>
</template>
    

<script lang="ts">
/* eslint-disable no-undef */
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { formatTime } from "@/utils/time"

@Component
export default class YoutubePlayer extends Vue {
    @Prop({ default: "" }) videoId!: string;
    player!: YT.Player;
    done = false;

    @Watch('videoId')
    onVideoIdChanged(newId: string){
        if (this.player && newId) this.player.loadVideoById(newId);
        else this.initPlayer();
    }

    createPlayer() {
        this.player = new YT.Player("player", {
            height: "390",
            width: "640",
            videoId: this.videoId,
            events: {
                onStateChange: this.onPlayerStateChange,
            },
            playerVars: {
                origin: "localhost", // TODO
                autoplay: 1
            }
        });
    }

    onPlayerStateChange(event: any) {
        if (event.data == YT.PlayerState.PAUSED) {
            this.$emit("player-paused", this.player.getCurrentTime())
        }
    }

    stopVideo() {
        this.player.stopVideo();
    }

    initPlayer() {
        window.onYouTubeIframeAPIReady = () => {
            this.createPlayer();
        };

        window.addEventListener("onPlayerStateChange", (event) => {
            this.onPlayerStateChange(event);
        });

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
    }
}
</script>