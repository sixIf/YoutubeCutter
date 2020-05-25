<template>
  <div>
    <v-container class="channel-container" fluid>
      <!-- <channel-dashboard></channel-dashboard> -->
      <v-row align="end" justify="center" no-gutters>
        <v-col cols="12" sm="8" md="4">
          <!-- <search-channel v-on:channel-fetched="displayVideos"></search-channel> -->
        </v-col>
        <!-- <v-col class="right-panel-col" cols="8">
          <list-channel-videos v-bind:videoList="videoList"></list-channel-videos>
        </v-col>-->
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ListChannelVideos from "../components/ListChannelVideos";

export default {
  name: "channel-videos",

  props: {
    videoList: undefined
  },

  components: {
    ListChannelVideos
    // ChannelDashboard
  },

  data: () => ({}),

  methods: {
    displayVideos(videoList) {
      this.videoList = videoList;
    }
  }
};
</script>
