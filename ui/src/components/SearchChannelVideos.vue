<template>
  <v-container class="fill-height left-panel" fluid>
    <v-row class="left-panel-row" align="start" justify="center">
      <v-col cols="12" sm="12" md="12">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Search Channel</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="findVideos">
              <v-text-field
                v-model="channelId"
                label="Channel ID"
                name="channel"
                prepend-icon="person"
                type="text"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click.prevent="changePage('next')">Next</v-btn>
            <v-btn color="secondary" @click.prevent="changePage('prev')">Previous</v-btn>
            <v-btn color="primary" type="submit" @click.prevent="findVideos">Search</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
// import Icon from "~/components/ui/Icon";
import axios from "axios";
export default {
  name: "search-channel-videos",
  components: {},
  props: {},
  data() {
    return {
      apiResponse: undefined,
      channelId: undefined
    };
  },
  // GET https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UChKMRHxLETrj_5JjiqExD1w&maxResults=10&key=[YOUR_API_KEY] HTTP/1.1

  methods: {
    changePage(direction) {
      var pageToken =
        direction == "next"
          ? this.apiResponse.data.nextPageToken
          : this.apiResponse.data.prevPageToken;
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
          this.apiResponse = response;
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
          this.apiResponse = response;
          this.$emit("channel-fetched", response.data.items);
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