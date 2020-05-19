<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Search Channel</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="findVideos">
                <v-text-field label="Channel ID" name="channel" prepend-icon="person" type="text"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" type="submit" @click.prevent="findVideos">Search</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
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
      videoList: undefined
    };
  },
  // GET https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UChKMRHxLETrj_5JjiqExD1w&maxResults=25&key=[YOUR_API_KEY] HTTP/1.1

  methods: {
    findVideos() {
      console.log("salut");
      axios
        .get(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25",
          {
            params: {
              channelId: this.practitionerId,
              key: this.$api_key
            }
          }
        )
        .then(response => {
          this.videoList = response.data;
        });
      console.log("ciao");
    }
  }
};
</script>
<!--
<style lang="stylus">
#app 
  background-color: black !important
</style>-->