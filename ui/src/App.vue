<template>
  <v-app>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import Home from "./views/Home";

export default {
  name: "App",

  components: {
    Home
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
