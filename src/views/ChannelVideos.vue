<template>
    <v-container fluide dense>
        <v-row class="sticky-toolbar">
            <v-col>
                <v-row>
                    <h1 v-if="playlistTitle == 'Uploaded Videos'">
                        {{ playlistTitle }}
                    </h1>
                    <h1 v-else>Playlists : {{ playlistTitle }}</h1>
                </v-row>
                <v-row justify="end">
                    <download-videos-modal
                        :itemType="itemType"
                        :itemsSelected="listVideoSelected"
                        :disabled="listVideoSelected.length == 0"
                    ></download-videos-modal>
                    <download-playlist-modal
                        v-if="isMainPlaylist"
                        :playlistId="playlistId"
                        :isMainPlaylist="isMainPlaylist"
                        :parentNextPageToken="nextPageToken"
                        :parentVideoList="videoList"
                    ></download-playlist-modal>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <list-items
                    style="position: relative; z-index: 3"
                    @update-list="updateSelectedList"
                    @more-items="fetchVideos(false)"
                    :itemType="itemType"
                    :itemList="videoList"
                />
            </v-col>
        </v-row>
    </v-container>
</template>


<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import DownloadVideosModal from "@/components/DownloadVideosModal.vue";
import DownloadPlaylistModal from "@/components/DownloadPlaylistModal.vue";
import { YOUTUBE_SERVICE, ItemStruct } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
import FiltersToolbar from "@/components/FiltersToolbar.vue";
import ListItems from "@/components/ListItems.vue";
import _ from "lodash";

@Component({
    components: {
        FiltersToolbar,
        ListItems,
        DownloadVideosModal,
        DownloadPlaylistModal,
    },
})
export default class ChannelVideos extends Vue {
    @Inject(YOUTUBE_SERVICE)
    service!: IYoutubeService;

    nextPageToken = "";
    videoList: ItemStruct[] = [];
    itemCount = 0;
    listVideoSelected: ItemStruct[] = [];
    itemType = "video";
    previousVideoListLength = 0;
    totalItemsExpected = 0;

    get channelId(): string {
        return this.$route.params.id;
    }

    get playlistId(): string {
        return this.$route.params.playlistId;
    }

    get isMainPlaylist(): boolean {
        return this.$route.params.playlistTitle ? false : true;
    }

    get playlistTitle(): string {
        return this.isMainPlaylist
            ? "Uploaded Videos"
            : this.$route.params.playlistTitle;
    }

    updateSelectedList(videoSelected: ItemStruct[]): void {
        this.listVideoSelected = [];
        if (videoSelected.length != 0)
            this.listVideoSelected = _.cloneDeep(videoSelected);
    }

    /**
     * Weird error for some channels when the nextPageToken doesn't return results at all, thus concept of previousVideoListLength
     */
    checkVideoList() {
        return (
            this.videoList.length < 100 &&
            this.videoList.length != this.previousVideoListLength &&
            this.videoList.length < this.totalItemsExpected
        );
    }

    /**
     * Display by default 100 videos for a quota cost of 60
     */
    async fetchVideos(firstCall: boolean) {
        try {
            const videoFetched = await this.service.getVideoList(
                this.playlistId,
                this.nextPageToken
            );
            // Please hold tight, protect me from the deadly infinite loop aka quota slayer
            this.totalItemsExpected = videoFetched.itemCount;
            if (this.totalItemsExpected > this.videoList.length) {
                this.previousVideoListLength = this.videoList.length;
                this.nextPageToken = videoFetched.nextPageToken;
                videoFetched.itemList.forEach((video) => {
                    this.videoList.push(video);
                });
                if (firstCall && this.checkVideoList()) this.fetchVideos(true);
                console.log(
                    `item count: ${this.totalItemsExpected} - videoList length ${this.videoList.length}`
                );
            } else {
                // Display no more videos ?
            }
        } catch (err) {
            // TODO send error back to home ?
            console.log("Channel video error:" + err);
            // this.$router.push("/");
        }
    }

    async created() {
        this.fetchVideos(true);
    }
}
</script>