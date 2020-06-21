<template>
  <div>
    <v-card class="elevation-12">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Search Youtube Channel</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-alert
          v-if="alert"
          dismissible
          v-model="displayAlert"
          :type="alert.type"
        >{{ alert.message }}</v-alert>
        <v-form @submit.prevent="getChannel">
          <v-text-field
            v-model="channelId"
            label="Channel ID"
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
          :disabled="!channelId"
          type="submit"
          @click.prevent="getChannel"
        >Search</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>


<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { YOUTUBESERVICE, ERROR_TYPES } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";

@Component
export default class SearchChannel extends Vue {
  @Inject(YOUTUBESERVICE)
  youtubeService!: IYoutubeService;

  videoList: string | null = null;
  channelId = "";
  // A interfacer si j'utilise plus
  alert: { type: string; message: string } | null = null;

  // displayAlert = false;

  get displayAlert() {
    if (this.alert) return true;
    else return false;
  }
  async getChannel(): Promise<void> {
    try {
      const response = await this.youtubeService.findChannelMainPlaylist(
        this.channelId
      );
      // Display channel not found since YT's api respond with 200
      if (response.totalResults == 0) {
        this.alert = {
          type: "error",
          message: "Channel not found. Please verify channel ID."
        };
      } else {
        this.$router.push({
          name: "channel-uploaded-videos",
          params: {
            id: this.channelId,
            playlistId: response.mainPlaylistId
          }
        });
      }
    } catch (err) {
      console.log("err: " + err);
      this.alert = {
        type: "error",
        message: `${ERROR_TYPES[err.response.status]}`
      };
    }
  }
}
</script>