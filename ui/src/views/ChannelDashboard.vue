<template>
  <div>
    <nav-drawer :channelId="channelId"></nav-drawer>
    <v-content>
      <v-container class="channel-container" fluid>
        <v-row align="start" justify="start" no-gutters>
          <v-col cols="12">
            <list-channel-videos v-bind:videoList="videoList"></list-channel-videos>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import NavDrawer from "../components/NavDrawer";
import ListChannelVideos from "../components/ListChannelVideos";

export default {
  name: "ChannelDashboard",

  components: {
    NavDrawer,
    ListChannelVideos
  },

  props: {
    videoList: undefined,
    channelId: undefined
  },

  data: () => ({}),

  methods: {
    displayVideos(videoList) {
      this.videoList = videoList;
    }
  },

  computed: {
    isHome() {
      return this.$route.path === "/";
    }
  },

  mounted() {
    // Check if we still got the channel
    if (!this.videoList) {
      this.$router.push("/");
    }
  }
};
</script>
