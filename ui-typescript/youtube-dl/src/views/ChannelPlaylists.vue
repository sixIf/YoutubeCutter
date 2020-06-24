<template>
  <v-container fluide dense>
    <v-row class="sticky-toolbar">
      <v-col>
        <v-row justify="end">
          <download-modal
            :itemType="itemType"
            :itemsSelected="listPlaylistSelected"
            :disabled="listPlaylistSelected.length == 0"
          >
            <!-- <template v-slot:activator="{ on }">
              <v-btn v-on="on" color="primary">Download</v-btn>
            </template>-->
          </download-modal>
          <!-- <v-btn color="secondary">Download</v-btn> -->
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <list-items
          style="z-index: 3"
          @more-items="fetchPlaylists"
          @update-list="updateSelectedList"
          :itemType="itemType"
          :itemList="playlistList"
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

@Component({
  components: {
    FiltersToolbar,
    ListItems,
    DownloadModal
  }
})
export default class ChannelPlaylist extends Vue {
  @Inject(YOUTUBESERVICE)
  service!: IYoutubeService;

  nextPageToken = "";
  playlistList: ItemStruct[] = [];
  listPlaylistSelected: string[] = [];
  itemType = "playlist";

  get channelId(): string {
    return this.$route.params.id;
  }

  updateSelectedList(playlistSelected: string[]): void {
    this.listPlaylistSelected = playlistSelected;
  }

  findVideoByKeyword(): void {
    console.log("To implement findVideoByKeyword");
  }

  fetchMoreVideos(): void {
    console.log("To implement findVideoByKeyword");
  }

  async fetchPlaylists() {
    try {
      const playlistsFetched = await this.service.getChannelPlaylists(
        this.channelId,
        this.nextPageToken
      );
      if (playlistsFetched.nextPageToken != this.nextPageToken) {
        this.nextPageToken = playlistsFetched.nextPageToken;
        playlistsFetched.itemList.forEach(playlist => {
          this.playlistList.push(playlist);
        });
      } else {
        // Display no more videos ?
      }
    } catch (err) {
      // TODO send error back to home ?
      console.log("Playlist video error:" + err);
      // this.$router.push("/");
    }
  }

  async created() {
    this.fetchPlaylists();
  }
}
</script>