<template>
    <div>
        <v-main>
            <v-container class="channel-container" fluid>
                <v-row align="start" justify="start" no-gutters>
                    <v-col cols="12">
                        <v-container fluide dense>
                            <v-row class="sticky-toolbar">
                                <v-col cols="12">
                                    <v-card>
                                        <v-row align="center">
                                            <v-col cols="3" md="2">
                                                <v-avatar size="100">
                                                    <img
                                                        :src="channelThumbnail"
                                                        :alt="channelTitle"
                                                    >    
                                                </v-avatar>
                                            </v-col>
                                            <v-col cols="4">
                                                <h1>{{channelTitle}}</h1>
                                            </v-col>
                                            <v-col cols="5">
                                                <h2>
                                                    {{ isMainPlaylist ? "Uploaded videos" : `Playlist : ${playlistTitle}`   }}  
                                                </h2>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                    <v-row justify="end">
                                        <download-videos-modal
                                            :videosSelected="listVideoSelected"
                                            :disabled="listVideoSelected.length == 0"
                                            :channelTitle="channelTitle"
                                            :playlistTitle="isMainPlaylist ? '' : playlistTitle"
                                        ></download-videos-modal>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-checkbox v-model="selectAll"></v-checkbox>
                            </v-row>
                            <list-items
                                style="position: relative; z-index: 3"
                                @update-list="updateSelectedList"
                                @more-items="fetchVideos(false)"
                                :itemType="itemType"
                                :itemList="videoList"
                                :selectAll="selectAll"
                            />
                        </v-container>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </div>
</template>

<script lang="ts">
import '@/router/componentHooks'
import { Component, Inject, Vue } from "vue-property-decorator";
import DownloadVideosModal from "@/components/DownloadVideosModal.vue";
import { YOUTUBE_SERVICE, ItemStruct } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
import FiltersToolbar from "@/components/FiltersToolbar.vue";
import ListItems from "@/components/ListItems.vue";
import _ from "lodash";
import ytpl from "ytpl";
import { NavigationGuardNext, Route } from 'vue-router';
const { myIpcRenderer, log } = window;

@Component({
    components: {
        FiltersToolbar,
        ListItems,
        DownloadVideosModal
    },
})
export default class ChannelDashboard extends Vue {
    @Inject(YOUTUBE_SERVICE)
    service!: IYoutubeService;
    videoList: ItemStruct[] = [];
    itemCount = 0;
    listVideoSelected: ItemStruct[] = [];
    itemType = "video";
    channelThumbnail: string | null = "";
    channelTitle: string | null = "";
    playlistTitle: string | null = "";
    selectAll = false;
  
    beforeRouteUpdate(to: Route, from: Route, next: NavigationGuardNext<Vue>) {
        next();
        this.getVideos();
    }

    get channelId(): string {
        return this.$route.params.id;
    }

    get playlistId(): string {
        return this.$route.params.playlistId;
    }

    get isMainPlaylist(): boolean {
        return this.playlistId ? false : true;
    }


    updateSelectedList(videoSelected: ItemStruct[]): void {
        this.listVideoSelected = [];
        if (videoSelected.length != 0)
            this.listVideoSelected = _.cloneDeep(videoSelected);
    }

    async getVideos(){
        // Get videos in playlist
        try {
            const response: ytpl.Result = await myIpcRenderer.invoke("getPlaylistVideos", this.playlistId ? this.playlistId : this.channelId)
            this.channelThumbnail = response.author.bestAvatar.url;
            this.channelTitle = response.author.name;
            this.playlistTitle = response.title;
            this.itemCount = response.estimatedItemCount;
            this.videoList = response.items.map((value) => {
                const item: ItemStruct = {
                    id: value.id,
                    title: value.title,
                    thumbnail: value.bestThumbnail.url ? value.bestThumbnail.url : ""
                };
                return item;
            })
        } catch (err) {
            log.info(err)
        }   
    }

     async mounted() {
        await this.getVideos();
    }

}
</script>