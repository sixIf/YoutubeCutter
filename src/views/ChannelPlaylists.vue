<template>
  <v-container fluide dense>
    <v-row class="sticky-toolbar">
      <v-col>
        <v-row justify="end">
          <download-modal
            :itemType="itemType"
            :itemsSelected="listPlaylistSelected"
            :disabled="listPlaylistSelected.length == 0"
          ></download-modal>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <list-items
          style="z-index: 3"
          @update-list="updateSelectedList"
          @more-items="fetchPlaylists(false)"
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
import _ from "lodash";

@Component({
  components: {
    FiltersToolbar,
    ListItems,
    DownloadModal,
  },
})
export default class ChannelPlaylist extends Vue {
  @Inject(YOUTUBESERVICE)
  service!: IYoutubeService;

  nextPageToken = "";
  playlistList: ItemStruct[] = [];
  listPlaylistSelected: ItemStruct[] = [];
  itemType = "playlist";
  previousPlaylistListLength = 0;
  totalItemsExpected = 0;

  get channelId(): string {
    return this.$route.params.id;
  }

  /**
   * Weird error for some channels when the nextPageToken doesn't return results at all, thus concept of previousPlalistListLength
   */
  checkplaylistList() {
    return (
      this.playlistList.length < 100 &&
      this.playlistList.length != this.previousPlaylistListLength &&
      this.playlistList.length < this.totalItemsExpected
    );
  }

  updateSelectedList(playlistSelected: ItemStruct[]): void {
    this.listPlaylistSelected = [];
    if (playlistSelected.length != 0)
      this.listPlaylistSelected = _.cloneDeep(playlistSelected);
  }

  async fetchPlaylists(firstCall: boolean) {
    try {
      const playlistsFetched = await this.service.getChannelPlaylists(
        this.channelId,
        this.nextPageToken
      );
      this.totalItemsExpected = playlistsFetched.itemCount;
      if (this.totalItemsExpected > this.playlistList.length) {
        this.previousPlaylistListLength = this.playlistList.length;
        this.nextPageToken = playlistsFetched.nextPageToken;
        playlistsFetched.itemList.forEach((playlist) => {
          this.playlistList.push(playlist);
        });
        console.log("hello firneds");
        console.log(this.checkplaylistList());
        if (firstCall && this.checkplaylistList()) this.fetchPlaylists(true);
        console.log(
          `item count: ${this.totalItemsExpected} - playlistList length ${this.playlistList.length}`
        );
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
    this.fetchPlaylists(true);
  }
}
</script>