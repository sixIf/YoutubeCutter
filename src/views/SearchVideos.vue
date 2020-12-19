<template>
    <v-container fluid>
        <v-row>
            <v-col cols="7" sm="5" lg="3">
                <search-videos-toolbar
                    @update-video-list="updateVideoList"
                    :emptyToolbar="emptyToolbar"
                ></search-videos-toolbar>
            </v-col>
            <v-col
                cols="5"
                sm="7"
                lg="9"
                style="height: 80vh; overflow-y: scroll"
            >
                <v-row class="download-button" justify="end">
                    <download-videos-modal
                        @download-started="emptyToolbar = !emptyToolbar"
                        :videosSelected="videoList"
                        :disabled="videoList.length == 0"
                    ></download-videos-modal>
                </v-row>
                <list-items
                    style="position: relative; z-index: 3"
                    :clickEnabled="false"
                    :itemType="itemType"
                    :itemList="videoList"
                    :rowHeight="70"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SearchVideosToolbar from "@/components/SearchVideosToolbar.vue";
import { YOUTUBE_SERVICE, ItemStruct } from "@/config/litterals";
import DownloadVideosModal from "@/components/DownloadVideosModal.vue";
import ListItems from "@/components/ListItems.vue";
import _ from "lodash";

@Component({
    components: { SearchVideosToolbar, ListItems, DownloadVideosModal },
})
export default class SearchVideos extends Vue {
    itemType = "video";
    emptyToolbar = false;
    videoList: ItemStruct[] = [];

    updateVideoList(newVideoList: ItemStruct[]): void {
        this.videoList = _.cloneDeep(newVideoList);
    }
}
</script>

<style lang="stylus">
.download-button
  margin-right 10px
  position: sticky
  top: 0px
  background-color white

</style>