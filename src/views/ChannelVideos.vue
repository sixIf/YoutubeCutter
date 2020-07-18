<template>
  <v-container fluide dense>
    <v-row class="sticky-toolbar">
      <v-col>
        <v-row>
          <h1 v-if="!playlistName">Uploaded videos</h1>
          <h1 v-else>Playlists : {{ playlistName }}</h1>
        </v-row>
        <v-row justify="end">
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
          @more-items="fetchVideos"
          @update-list="updateSelectedList"
          :itemType="itemType"
          :itemList="videoList"
        />
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
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
    DownloadModal
  }
})
export default class ChannelVideos extends Vue {
  @Inject(YOUTUBESERVICE)
  service!: IYoutubeService;

  @Prop({ default: "" }) playlistName!: string;
  nextPageToken = "";
  videoList: ItemStruct[] = [];
  listVideoSelected: ItemStruct[] = [];
  itemType = "video";

  get channelId(): string {
    return this.$route.params.id;
  }

  get playlistId(): string {
    return this.$route.params.playlistId;
  }

  updateSelectedList(videoSelected: ItemStruct[]): void {
    this.listVideoSelected = _.cloneDeep(videoSelected);
  }

  async fetchVideos() {
    try {
      const videoFetched = await this.service.getVideoList(
        this.playlistId,
        this.nextPageToken
      );
      if (videoFetched.nextPageToken != this.nextPageToken) {
        this.nextPageToken = videoFetched.nextPageToken;
        videoFetched.itemList.forEach(video => {
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

  async created() {
    // Reset video list
    this.fetchVideos();
  }
}
</script>