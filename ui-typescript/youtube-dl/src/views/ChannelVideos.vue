<template>
  <div>
    <filters-toolbar searchLabel="Search specific video" v-on:search-keyword="findVideoByKeyword" />
    <list-items @more-items="fetchMoreVideos" :itemType="itemType" :itemList="videoList" />
  </div>
</template>


<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { YOUTUBESERVICE, API_KEY, ItemStruct } from "@/config/litterals";
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
  videoList: ItemStruct[] | null = null;
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
      console.log("channelVideos fetchVideos");
      // const response = await this.service.fetchVideoInPlaylist(
      //   API_KEY,
      //   this.mainPlaylistId,
      //   this.nextPageToken
      // );
    } catch (err) {
      this.$router.push("/");
      console.log(err);
    }
  }

  async mounted() {
    try {
      console.log("channelVideos mounted");
      // const response = await this.service.findMainPlaylist(
      //   API_KEY,
      //   this.channelId
      // );
      // // Get videos from channel's playlist "uploaded videos"
      // this.mainPlaylistId =
      //   response.data.items[0].contentDetails.relatedPlaylists.uploads;
    } catch (err) {
      // TODO send error back to home ?
      this.$router.push("/");
    }
    this.fetchVideos();
  }
}
</script>