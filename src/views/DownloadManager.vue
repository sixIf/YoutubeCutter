<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <v-row>
                    <youtube-player />
                </v-row>
                <v-row></v-row>
            </v-col>
            <v-col cols="6">
                <span>In coming list</span>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import YoutubePlayer from "@/components/YoutubePlayer.vue"

@Component({
    components: {
        YoutubePlayer
    }
})
export default class DownloadManager extends Vue {

}
</script>