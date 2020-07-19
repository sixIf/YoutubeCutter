<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col cols="7" sm="5" lg="3">
          <search-videos-toolbar @update-video-list="updateVideoList"></search-videos-toolbar>
        </v-col>
        <v-col cols="5" sm="7" lg="9">
          <v-row class="download-button" justify="end">
            <download-modal
              :itemType="itemType"
              :itemsSelected="videoList"
              :disabled="videoList.length == 0"
            ></download-modal>
          </v-row>
          <list-items
            style="position: relative; z-index: 3"
            :clickEnabled="false"
            :itemType="itemType"
            :itemList="videoList"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SearchVideosToolbar from "@/components/SearchVideosToolbar.vue";
import { YOUTUBESERVICE, ItemStruct } from "@/config/litterals";
import DownloadModal from "@/components/DownloadModal.vue";
import ListItems from "@/components/ListItems.vue";

@Component({
  components: { SearchVideosToolbar, ListItems, DownloadModal }
})
export default class SearchVideos extends Vue {
  itemType = "video";
  videoList: ItemStruct[] = [];

  updateVideoList(newVideoList: ItemStruct[]): void {
    // TODO: Lodash ?
    this.videoList = newVideoList;
  }
}
</script>

<style lang="stylus">
.download-button
  margin-right 10px
</style>