<template>
  <div class="home">
    <v-container class="app-container" fluid>
      <v-row class="app-row" align="start" no-gutters>
        <v-col class="left-panel-col" cols="4">
          <search-channel-videos v-on:channel-fetched="displayVideos"></search-channel-videos>
        </v-col>
        <v-col class="right-panel-col" cols="8">
          <list-channel-videos v-bind:videoList="videoList"></list-channel-videos>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SearchChannelVideos from "../components/SearchChannelVideos";
import ListChannelVideos from "../components/ListChannelVideos";

export default {
  name: "Home",

  components: {
    ListChannelVideos,
    SearchChannelVideos
  },

  data: () => ({
    videoList: undefined
  }),

  methods: {
    displayVideos(videoList) {
      this.videoList = videoList;
    }
  }
};
</script>
