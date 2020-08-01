<template>
  <v-container fluide dense>
    <v-row class="sticky-toolbar">
      <v-col>
        <v-row>
          <h1 v-if="playlistTitle=='Uploaded Videos'">{{ playlistTitle }}</h1>
          <h1 v-else>Playlists : {{ playlistTitle }}</h1>
        </v-row>
        <v-row justify="end">
          <v-btn button @click="toggleAll = !toggleAll">{{ computeToggleBtnName }}</v-btn>
          <download-modal
            :itemType="itemType"
            :itemsSelected="listVideoSelected"
            :disabled="listVideoSelected.length == 0"
          ></download-modal>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <list-items
          style="position: relative; z-index: 3"
          @update-list="updateSelectedList"
          @more-items="fetchVideos(false)"
          :toggleAll="toggleAll"
          :itemType="itemType"
          :itemList="videoList"
        />
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import DownloadModal from "@/components/DownloadModal.vue";
import { YOUTUBESERVICE, ItemStruct } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
import FiltersToolbar from "@/components/FiltersToolbar.vue";
import ListItems from "@/components/ListItems.vue";
import _ from "lodash";

@Component({
  components: {
    FiltersToolbar,
    ListItems,
    DownloadModal,
  },
})
export default class ChannelVideos extends Vue {
  @Inject(YOUTUBESERVICE)
  service!: IYoutubeService;

  nextPageToken = "";
  videoList: ItemStruct[] = [];
  itemCount = 0;
  toggleAll = false;
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

  get playlistTitle(): string {
    return this.$route.params.playlistTitle
      ? this.$route.params.playlistTitle
      : "Uploaded Videos";
  }
  get computeToggleBtnName(): string {
    return this.toggleAll ? "Uncheck all" : "Check all";
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
    // Reset video list
    this.fetchVideos(true);
  }
}
</script>