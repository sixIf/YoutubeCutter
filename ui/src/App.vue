<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
import NavDrawer from "./components/NavDrawer";

export default {
  name: "App",

  components: {
    NavDrawer
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
    }
  }
};
</script>
