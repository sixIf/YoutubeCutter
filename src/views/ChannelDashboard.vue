<template>
    <v-container class="channel-container" fluid>
        <v-row align="start" class="sticky-toolbar mb-5" justify="start" no-gutters style="height: 100%">
            <v-col cols="8" lg="5">
                <v-card elevation="3" height="150px">
                    <v-row>
                        <v-col cols="4" lg="2" style="height: 100%">
                            <v-row style="height: 100%">
                                <v-col>
                                    <v-avatar size="100" class="ml-2">
                                        <img
                                            :src="channelThumbnail"
                                            :alt="channelTitle"
                                        >    
                                    </v-avatar>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-divider vertical/>
                        <v-col cols="7" lg="9">
                            <h3 style="padding-top: 5px;">
                                {{limitChar(channelTitle, 30)}}
                            </h3>
                            <v-card flat>
                                <v-card-title>
                                    {{ isMainPlaylist ? ($__("Channel.uploaded")) : limitChar(`Playlist : ${playlistTitle}`, 20)   }}  
                                </v-card-title>
                                <v-card-subtitle>
                                    {{ `${itemCount} ${$__("Channel.videos")}` }}
                                </v-card-subtitle>
                            </v-card>
                        </v-col>                                
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="4" lg="6">
                <v-row>
                    <v-col>
                        <v-btn 
                            color="secondary" 
                            class="mb-2" 
                            @click="selectAll=!selectAll">
                                {{$__(`Channel.${selectAll ? 'unSelectAll' : 'selectAll'}`)}}
                            </v-btn>
                    </v-col>
                    <v-col>
                        <download-videos-modal
                            :videosSelected="listVideoSelected"
                            :disabled="listVideoSelected.length == 0"
                            :channelTitle="channelTitle"
                            :playlistTitle="isMainPlaylist ? '' : playlistTitle"
                        ></download-videos-modal>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-container class="channel-container" fluid>
        <v-row>
            <list-items
                style="position: relative; z-index: 3"
                @update-list="updateSelectedList"
                @more-items="fetchVideos(false)"
                :itemType="itemType"
                :itemList="videoList"
                :selectAll="selectAll"
            />
        </v-row>
    </v-container>
    </v-container>
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

    limitChar(phrase: string, maxChar: number){
        return phrase.length > maxChar ? 
            phrase.slice(0, maxChar) + '...' :
            phrase;
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