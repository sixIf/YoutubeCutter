<template>
  <v-container class="home-container fill-height" fluid>
    <v-row>
      <v-col cols="3">
        <!-- Send id's list input by user in the toolbar by event when clicking on search -->
        <search-videos-toolbar></search-videos-toolbar>
      </v-col>
      <v-col cols="9">
        <!-- Here display channel  -->
        <list-items
          style="position: relative; z-index: 3"
          @more-items="console.log('You crazy dude')"
          @update-list="console.log('You crazy dude')"
          :itemType="itemType"
          :itemList="videoList"
        />
      </v-col>
    </v-row>
  </v-container>
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
}
</script>