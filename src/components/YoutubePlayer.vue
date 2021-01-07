<template>
    <div id="player"></div>
</template>
    

<script lang="ts">
/* eslint-disable no-undef */
import { Component, Vue, Prop, Inject, Watch } from "vue-property-decorator";
import { formatTime } from "@/utils/time"
import { DownloadRequest, DOWNLOAD_FOLDER_SERVICE, VideoDetail } from "@/config/litterals";
import { generateUniqueId } from "@/helpers/stringHelper";
import { IDownloadFolderService } from "@/services/downloadFolderService";
const { myIpcRenderer } = window;

@Component
export default class YoutubePlayer extends Vue {
    @Inject(DOWNLOAD_FOLDER_SERVICE)
    downloadFolderService!: IDownloadFolderService;    
    @Prop({ default: "" }) videoId!: string;
    player!: YT.Player;
    done = false;

    @Watch('videoId')
    onVideoIdChanged(newId: string){
        if (newId && this.player) {
            this.player.loadVideoById(newId)
        }
    }

    initPlayer() {
        this.player = new YT.Player("player", {
            height: "390",
            width: "640",
            videoId: this.videoId,
            events: {
                onReady: this.onPlayerReady,
                onStateChange: this.onPlayerStateChange,
            },
        });
    }

    startDl(){
        const videoSelected: VideoDetail = {
            id: this.videoId,
            title: 'Test',
            thumbnail: 'balec',
        }
        const downloadRequest: DownloadRequest = {
            requestId: generateUniqueId(),
            audioOnly: false,
            playlistTitle: 'this.playlistTitle',
            channelTitle: 'this.channelTitle',
            itemSelected: [videoSelected],
            downloadFolder: this.downloadFolderService.getDownloadFolder(),
        };

        myIpcRenderer.send("download-videos", downloadRequest);        
    }

    onPlayerReady(event: any) {
        // this.player.playVideo();
        console.log(this.player.getDuration())
        console.log(formatTime(this.player.getDuration()));
    }

    onPlayerStateChange(event: any) {
        console.log(`current time ${this.player.getCurrentTime()}`)
        if (event.data == YT.PlayerState.PAUSED) {
            this.$emit("player-paused", this.player.getCurrentTime())
        }

        // if (event.data == YT.PlayerState.PLAYING && !this.done) {
            // setTimeout(this.stopVideo, 6000);
            // this.done = true;
        // }
    }

    stopVideo() {
        this.player.stopVideo();
    }

    mounted() {
        window.onYouTubeIframeAPIReady = () => {
            console.log("onYouTubeIframeAPIReady");
            this.initPlayer();
        };

        window.addEventListener("onPlayerReady", (event) => {
            console.log("onPlayerReady");
        });

        window.addEventListener("onPlayerStateChange", (event) => {
            console.log("onPlayerStateChange");
        });

        if(document.getElementById('iframe-api')) this.initPlayer();
        else {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            tag.id = "iframe-api"
            const firstScriptTag = document.getElementsByTagName("script")[0];
            if (firstScriptTag.parentNode)
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

    }
}
</script>