<template>
  <v-content>
    <v-container class="home-container fill-height" fluid>
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Search Youtube Channel</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <alert v-if="alert" :alert="alert"></alert>
              <v-form @submit.prevent="getChannel">
                <v-text-field
                  v-model="videoUrl"
                  label="Video URL from requested channel"
                  hint="Copy here whatever video from the youtube channel you want to explore."
                  name="channel"
                  prepend-icon="person"
                  type="text"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :disabled="!videoUrl"
                type="submit"
                @click.prevent="getChannel"
              >Search</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>


<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { YOUTUBESERVICE, ERROR_TYPES, IAlert } from "@/config/litterals";
import Alert from "@/components/Alert.vue";
import { IYoutubeService } from "@/services/youtubeService";

@Component({
  components: {
    Alert
  }
})
export default class SearchChannel extends Vue {
  @Inject(YOUTUBESERVICE)
  youtubeService!: IYoutubeService;

  videoList: string | null = null;
  videoUrl = "";
  alert: IAlert | null = null;

  videoId(): string {
    return this.youtubeService.extractVideoIdFromUrl(this.videoUrl);
  }

  get displayAlert() {
    if (this.alert) return true;
    else return false;
  }
  async getChannel(): Promise<void> {
    this.alert = null;
    try {
      const response = await this.youtubeService.findChannelByVideo(
        this.videoId()
      );
      // Display channel not found since YT's api respond with 200
      if (response.totalResults == 0) {
        this.alert = {
          type: "error",
          message: "Channel not found. Please verify your link."
        };
      } else {
        this.$router.push({
          name: "channel-uploaded-videos",
          params: {
            id: response.id,
            playlistId: response.mainPlaylistId,
            channelTitle: response.channelTitle
          }
        });
      }
    } catch (err) {
      console.log("err: " + err);
      const status = err.response ? err.response.status : "404";
      this.alert = {
        type: "error",
        message: `${ERROR_TYPES[status]}`
      };
    }
  }
}
</script>