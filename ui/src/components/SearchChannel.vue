<template>
  <div>
    <v-card class="elevation-12">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Search Channel</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-alert dismissible v-model="displayAlert" :type="alert.type">{{ alert.message }}</v-alert>
        <v-form @submit.prevent="findVideos">
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
        <v-btn color="secondary" @click.prevent="changePage('next')">Next</v-btn>
        <v-btn color="secondary" @click.prevent="changePage('prev')">Previous</v-btn>
        <v-btn
          color="primary"
          :disabled="!channelId"
          type="submit"
          @click.prevent="findVideos"
        >Search</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>


<script>
import axios from "axios";
export default {
  name: "search-channel-videos",
  components: {},
  props: {},
  data() {
    return {
      videoList: undefined,
      channelId: undefined,
      alert: {
        type: undefined,
        message: undefined
      },
      channelInfos: undefined,
      displayAlert: false
    };
  },
  // GET https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UChKMRHxLETrj_5JjiqExD1w&maxResults=10&key=[YOUR_API_KEY] HTTP/1.1

  methods: {
    changePage(direction) {
      var pageToken =
        direction == "next"
          ? this.videoList.data.nextPageToken
          : this.videoList.data.prevPageToken;
      axios
        .get(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=10",
          {
            params: {
              channelId: this.channelId,
              key: this.$api_key,
              pageToken: pageToken
            }
          }
        )
        .then(response => {
          this.videoList = response;
        });
    },
    findVideos() {
      axios
        .get(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=10",
          {
            params: {
              channelId: this.channelId,
              key: this.$api_key
            }
          }
        )
        .then(response => {
          this.videoList = response;

          this.$router
            .push({
              name: "channel",
              params: {
                videoList: response.data.items,
                channelId: this.channelId
              }
            })
            .catch(err => {
              console.log(err);
            });
          // this.$emit("channel-fetched", response.data.items);
        })
        .catch(err => {
          this.alert = {
            type: "error",
            message: "Channel not found. Please verify the channel id."
          };
          this.displayAlert = true;
          console.log(err);
        });
    }
  }
};
</script>
<!--
<style lang="stylus">
#app 
  background-color: black !important
</style>-->