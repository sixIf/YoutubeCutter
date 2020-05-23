<template>
  <div>
    <v-container v-if="videoList" class="list-video-container" fluid>
      <v-row dense>
        <v-col v-for="video in videoList" :key="video.id.videoId" cols="4">
          <v-card>
            <v-img
              :src="video.snippet.thumbnails.default.url"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="video.snippet.title"></v-card-title>
            </v-img>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon @click="downloadSingleVideo">
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
          <!--<v-card class="elevation-12">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click.prevent="changePage('next')">Next</v-btn>
              <v-btn color="secondary" @click.prevent="changePage('prev')">Previous</v-btn>
              <v-btn color="primary"  @click.prevent="findVideos">Search</v-btn>
            </v-card-actions>
          </v-card>-->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
// import Icon from "~/components/ui/Icon";
import axios from "axios";
import ytdl from "ytdl-core";
export default {
  name: "search-channel-videos",
  components: {},
  props: {
    videoList: undefined
  },
  data() {
    return {
      channelId: undefined
    };
  },
  // GET https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UChKMRHxLETrj_5JjiqExD1w&maxResults=25&key=[YOUR_API_KEY] HTTP/1.1

  methods: {
    changePage(direction) {
      var pageToken =
        direction == "next"
          ? this.videoList.data.nextPageToken
          : this.videoList.data.prevPageToken;
      axios
        .get(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=25",
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
    downloadSingleVideo() {
      const fs = require("fs");

      ytdl("http://www.youtube.com/watch?v=A02s8omM_hI").pipe(
        fs.createWriteStream("video.flv")
      );
    },
    findVideos() {
      axios
        .get(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=25",
          {
            params: {
              channelId: this.channelId,
              key: this.$api_key
            }
          }
        )
        .then(response => {
          this.videoList = response;
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