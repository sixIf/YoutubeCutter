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
import axios from "axios";
import { Component, Inject, Provide, Vue } from "vue-property-decorator";
import { YOUTUBESERVICE, ERROR_TYPES, API_KEY } from "@/config/litterals";
import { IYoutubeService } from "@/api/youtube";

@Component({})
export default class SearchChannel extends Vue {
  @Inject(YOUTUBESERVICE)
  service!: IYoutubeService;

  videoList: string | null = null;
  channelId = "";
  // A interfacer si j'utilise plus
  alert: { type: string; message: string } | null = null;

  displayAlert = false;

  async getChannel(): Promise<void> {
    console.log(this.service);
    this.service.fetchVideoInPlaylist;
    try {
      const response = await this.service.findChannelById(
        API_KEY,
        this.channelId
      );
      console.log(response);
      // Display channel not found since YT's api respond with 200
      if (response.data.pageInfo.totalResults == 0) {
        this.alert = {
          type: "error",
          message: "Channel not found. Please verify channel ID."
        };
        this.displayAlert = true;
      } else {
        // TODO : define routes and next vue
        // this.$router.push({
        //   name: "channel-videos",
        //   params: {
        //     id: this.channelId
        //   }
        // });
      }
    } catch (err) {
      this.alert = {
        type: "error",
        message: `${ERROR_TYPES[err.response.status]}`
      };
      this.displayAlert = true;
    }
  }
  //   axios
  //     .get(
  //       "https://www.googleapis.com/youtube/v3/channels?part=snippet&maxResults=1",
  //       {
  //         params: {
  //           id: this.channelId,
  //           key: this.$api_key
  //         }
  //       }
  //     )
  //     .then(response => {
  //       // Display channel not found since YT's api respond with 200
  //       if (response.data.pageInfo.totalResults == 0) {
  //         this.alert = {
  //           type: "error",
  //           message: "Channel not found. Please verify channel ID."
  //         };
  //         this.displayAlert = true;
  //       } else {
  //         this.$router
  //           .push({
  //             name: "channel-videos",
  //             params: {
  //               id: this.channelId
  //             }
  //           })
  //           .catch(err => {
  //             console.log(err);
  //           });
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       this.alert = {
  //         type: "error",
  //         message: `${this.$error_type[err.response.status]}`
  //       };
  //       this.displayAlert = true;
  //     });
  // }
}
</script>