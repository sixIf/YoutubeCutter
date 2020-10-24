<template>
    <v-tab-item style="height: 90vh; overflow-y: scroll">
        <v-btn
            v-if="videos.length != 0 && !isDownloading"
            style="margin: 20px"
            @click="clearDownloadedList"
            >Clear list</v-btn
        >
        <v-list v-for="infos in videos" :key="infos.video.id">
            <v-list-item v-if="videos.length > 0">
                <template v-slot:default>
                    <v-list-item-content>
                        <v-list-item-title>{{
                            infos.video.title
                        }}</v-list-item-title>
                        <v-list-item-subtitle
                            v-if="isDownloading"
                            style="padding-left: 10px"
                            >1. Downloading audio
                            {{ infos.progressAudio }}%</v-list-item-subtitle
                        >
                        <div v-if="!infos.audioOnly && isDownloading">
                            <v-list-item-subtitle style="padding-left: 10px"
                                >2. Downloading video
                                {{ infos.progressVideo }}%</v-list-item-subtitle
                            >
                        </div>
                    </v-list-item-content>
                    <v-list-item-action v-if="isDownloading">
                        <v-progress-circular indeterminate color="primary" />
                    </v-list-item-action>
                    <v-list-item-icon v-else>
                        <v-icon @click="open(infos.video.folderPath)"
                            >mdi-folder
                        </v-icon>
                        <v-icon @click="open(infos.video.filePath)"
                            >mdi-play
                        </v-icon>
                    </v-list-item-icon>
                </template>
            </v-list-item>
            <v-divider></v-divider>
        </v-list>
    </v-tab-item>
</template>

<script lang="ts">
import { ItemDownloading } from "@/config/litterals";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class QueueListItem extends Vue {
    @Prop({ default: true }) isDownloading!: boolean;
    @Prop({ default: [] }) videos!: ItemDownloading[];

    clearDownloadedList() {
        this.$emit("clear");
    }

    open(path: string) {
        window.myIpcRenderer.send("open-shell", path);
    }
}
</script>