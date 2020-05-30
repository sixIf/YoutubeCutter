<template>
  <div>
    <v-card class="elevation-12">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Search Youtube Channel</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-alert dismissible v-model="displayAlert" :type="alert.type">{{ alert.message }}</v-alert>
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
        <!-- <v-btn color="secondary" @click.prevent="changePage('next')">Next</v-btn>
        <v-btn color="secondary" @click.prevent="changePage('prev')">Previous</v-btn>-->
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

  methods: {
    // changePage(direction) {
    //   var pageToken =
    //     direction == "next"
    //       ? this.videoList.data.nextPageToken
    //       : this.videoList.data.prevPageToken;
    //   axios
    //     .get(
    //       "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=10",
    //       {
    //         params: {
    //           channelId: this.channelId,
    //           key: this.$api_key,
    //           pageToken: pageToken
    //         }
    //       }
    //     )
    //     .then(response => {
    //       this.videoList = response;
    //     });
    // },
    getChannel() {
      axios
        .get(
          "https://www.googleapis.com/youtube/v3/channels?part=snippet&maxResults=1",
          {
            params: {
              id: this.channelId,
              key: this.$api_key
            }
          }
        )
        .then(response => {
          let channelInfos = response.data.items[0].snippet;
          this.channelTitle = channelInfos.channelTitle;
          this.channelThumbnail = channelInfos.thumbnails.high.url;
          // this.$emit("channel-fetched", response.data.items);
          this.$router
            .push({
              name: "channel-videos",
              params: {
                channelTitle: this.channelTitle,
                channelThumbnail: this.channelThumbnail,
                channelId: this.channelId
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
          this.alert = {
            type: "error",
            message: `${this.$error_type[err.response.status]}`
          };
          this.displayAlert = true;
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