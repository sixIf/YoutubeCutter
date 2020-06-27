<template>
  <v-card class="search-toolbar" min-width="100%">
    <v-card-title>Search Youtube video</v-card-title>

    <v-divider></v-divider>
    <alert v-if="alert" :alert="alert"></alert>
    <v-card-actions>
      <v-form style="width: 100%" v-on:submit.prevent>
        <v-text-field
          class="video-list"
          append-outer-icon="mdi-send"
          hint="https://www.youtube.com/watch?v=jNQXAC9IVRw"
          outlined
          v-model="videoUrl"
          label="Youtube URL"
          @click:append-outer="findVideo"
          @keydown.enter="findVideo"
          full-width
        ></v-text-field>
        <v-btn class="card-action" :disabled="videosFetched != []" color="primary">Download</v-btn>
      </v-form>
    </v-card-actions>
    <v-card-text>
      <v-list v-for="(video, index) in videosFetched" :key="video.id">
        <v-list-item>
          <template v-slot:default>
            <v-list-item-action>
              <v-icon @click="removeVideo(index)">mdi-delete</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{video.title}}</v-list-item-title>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Inject, Watch, Vue } from "vue-property-decorator";
import {
  YOUTUBESERVICE,
  VideoFetched,
  ItemStruct,
  ERROR_TYPES,
  IAlert
} from "@/config/litterals";
import Alert from "@/components/Alert.vue";
import { IYoutubeService } from "@/services/youtubeService";

@Component({
  components: {
    Alert
  }
})
export default class SearchVideosToolbar extends Vue {
  @Inject(YOUTUBESERVICE)
  service!: IYoutubeService;

  videoUrl = "";
  videosFetched: ItemStruct[] = [];
  alert: IAlert | null = null;

  videoId(): string {
    const indexOfId = this.videoUrl.indexOf("?v=") + 3;
    const indexOfAmp = this.videoUrl.indexOf("&");
    if (indexOfAmp != -1) return this.videoUrl.slice(indexOfId, indexOfAmp);
    else return this.videoUrl.slice(indexOfId);
  }
  removeVideo(index: number) {
    this.videosFetched.splice(index, 1);
  }
  async findVideo() {
    this.alert = null;
    try {
      const response = await this.service.findVideoById(this.videoId());
      if (response.totalResults == 0) {
        this.alert = {
          type: "error",
          message: "Video not found. Please check your video's URL."
        };
      } else {
        this.videosFetched.push(response.videoInfos);
        this.videoUrl = "";
      }
    } catch (error) {
      console.log("Catch error " + error.message);
      this.alert = {
        type: "error",
        message: `${ERROR_TYPES[error.response.status]}`
      };
    }
  }

  @Watch("videosFetched")
  onVideoFetchedChanged(val: ItemStruct[], oldVal: ItemStruct[]) {
    console.log("je vais envoyer ça : ");
    console.log(val);
    this.$emit("update-video-list", val);
  }
}
</script>

<style lang="stylus">
.card-action
  position absolute
  bottom 10px

.video-list
  width 90%
  margin-bottom 15px

.search-toolbar
  height 500px  
</style>