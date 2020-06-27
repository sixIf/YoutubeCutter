<template>
  <v-content>
    <v-container fluid>
      <v-row>
        <v-col cols="3">
          <!-- <v-row justify="start" align="stretch" style="height: 500px;"> -->
          <search-videos-toolbar @update-video-list="updateVideoList"></search-videos-toolbar>
          <!-- </v-row> -->
        </v-col>
        <v-col cols="9">
          <list-items
            style="position: relative; z-index: 3"
            :itemType="itemType"
            :itemList="videoList"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SearchVideosToolbar from "@/components/SearchVideosToolbar.vue";
import { YOUTUBESERVICE, ItemStruct } from "@/config/litterals";
import ListItems from "@/components/ListItems.vue";

@Component({
  components: { SearchVideosToolbar, ListItems }
})
export default class SearchVideos extends Vue {
  listVideoSelected: string[] = [];
  itemType = "video";
  videoList: ItemStruct[] = [];

  updateVideoList(newVideoList: ItemStruct[]): void {
    // TODO: Lodash ?
    console.log("on a pudate");
    console.log(newVideoList);
    this.videoList = newVideoList;
  }
}
</script>