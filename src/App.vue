<template>
    <v-app>
        <div>
            <v-snackbar v-model="snackbar" top color="info">
                {{ snackbarMessage }}
                <template v-slot:action="{ attrs }">
                    <v-btn dark text v-bind="attrs" @click="snackbar = false"
                        >Close</v-btn
                    >
                </template>
            </v-snackbar>
            <v-app-bar color="primary" style="z-index: 50" app dense dark>
                <router-link to="/">
                    <v-btn icon>
                        <v-icon>mdi-home</v-icon>
                    </v-btn>
                </router-link>
                <v-toolbar-title @click="$router.push('/')" style="cursor: pointer">Youtube Downloader</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon v-if="isDownloading">
                    <v-icon>mdi-download-circle</v-icon>
                </v-btn>
                <router-link to="/help">
                    <v-btn icon>
                        <v-icon>mdi-help-circle</v-icon>
                    </v-btn>
                </router-link>
                <router-link to="/settings">
                    <v-btn icon>
                        <v-icon>mdi-cog</v-icon>
                    </v-btn>
                </router-link>
            </v-app-bar>
            <download-queue-drawer />
        </div>
        <router-view />
    </v-app>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DownloadQueueDrawer from "@/components/DownloadQueueDrawer.vue";
import { DownloadRequest } from "./config/litterals";
import { clickInfo } from "./config/litterals/youtube";
const { myIpcRenderer } = window;

// Define the component in class-style
@Component({
    components: {
        DownloadQueueDrawer,
    },
})
export default class App extends Vue {
    isDownloading = false;
    snackbar = false;
    snackbarMessage = "";

    mounted() {
        window.open("https://youtube.com");
        myIpcRenderer.receive(
            "download-error",
            (data: DownloadRequest) => {
                this.snackbar = true;
                this.snackbarMessage = `Download error : ${data.itemSelected[0].title}`;
            }
        );

        myIpcRenderer.receive(
            "add-single-video",
            (videoID: string) => {
                if(this.$route.name != 'search-videos'){
                    this.$router.push({
                        name: "search-videos",
                        params: {
                            videoID: videoID
                        }
                    })
                }
            }
        )

        myIpcRenderer.receive(
            "explore-channel",
            (infos: clickInfo) => {
                if(this.$route.params.channelID != infos.channelID){
                    window.log.info(`voila les params: channel ${infos.channelID} playlist ${infos.playlistID} et channel params ${this.$route.params.channelID}`)
                    const routeParams = {};
                    if (infos.channelID) Object.assign(routeParams, { id: infos.channelID})
                    if (infos.playlistID) Object.assign(routeParams, { id: infos.playlistID})
                    this.$router.replace({
                        name: "channel-view",
                        params: routeParams
                    })
                }
            }
        )
    }
}
</script>
<style>
html {
    overflow: hidden;
}
/* width */
::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px white;
    border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #d32f2f;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #e57373;
}
</style>