<template>
  <div>
    <!-- <filters-toolbar searchLabel="Search specific video" v-on:search-keyword="findVideoByKeyword" /> -->
    <list-items
      style="position: relative; z-index: 3"
      @more-items="fetchVideos"
      :itemType="itemType"
      :itemList="videoList"
    />
  </div>
</template>


<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { YOUTUBESERVICE, ItemStruct } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
import FiltersToolbar from "@/components/FiltersToolbar.vue";
import ListItems from "@/components/ListItems.vue";

@Component({
  components: {
    FiltersToolbar,
    ListItems
  }
})
export default class ChannelVideos extends Vue {
  @Inject(YOUTUBESERVICE)
  service!: IYoutubeService;

  mainPlaylistId = "";
  nextPageToken = "";
  videoList: ItemStruct[] = [];
  itemType = "video";

  get channelId(): string {
    return this.$route.params.id;
  }

  findVideoByKeyword(): void {
    console.log("To implement findVideoByKeyword");
  }

  fetchMoreVideos(): void {
    console.log("To implement findVideoByKeyword");
  }

  async fetchVideos() {
    try {
      const videoFetched = await this.service.getVideoList(
        this.mainPlaylistId,
        this.nextPageToken
      );
      if (videoFetched.nextPageToken != this.nextPageToken) {
        this.nextPageToken = videoFetched.nextPageToken;
        videoFetched.videoList.forEach(video => {
          this.videoList.push(video);
        });
      } else {
        // Display no more videos ?
      }
    } catch (err) {
      // TODO send error back to home ?
      console.log("Channel video error:" + err);
      // this.$router.push("/");
    }
  }

  async mounted() {
    // Get main playlist id
    try {
      const responsePlaylistId = await this.service.findChannelMainPlaylist(
        this.channelId
      );
      this.mainPlaylistId = responsePlaylistId.mainPlaylistId;
    } catch (err) {
      // TODO send error back to home ?
      console.log("Channel video error findChannelMainPlaylist:" + err);
    }
    this.fetchVideos();
  }
}
</script>