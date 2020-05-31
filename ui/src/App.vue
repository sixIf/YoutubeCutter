<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
const default_layout = "default";
export default {
  name: "App",

  components: {},

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
