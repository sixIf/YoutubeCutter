<template>
  <v-app>
    <router-view v-if="isHome" />
    <component v-else :is="layout">
      <router-view />
    </component>
  </v-app>
</template>

<script>
import ChannelDashboard from "./layouts/ChannelDashboard";

const default_layout = "default";
export default {
  name: "App",

  components: {
    // ChannelDashboard
  },

  data: () => ({
    videoList: undefined
  }),

  methods: {
    displayVideos(videoList) {
      this.videoList = videoList;
    }
  },

  computed: {
    isHome() {
      return this.$route.path === "/";
    },
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    }
  }
};
</script>
