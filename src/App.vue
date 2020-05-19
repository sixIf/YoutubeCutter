<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title style="color: white;">Youtube Downloader</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import SearchChannelVideos from "./components/SearchChannelVideos";

export default {
  name: "App",

  components: {
    HelloWorld,
    SearchChannelVideos
  },

  data: () => ({
    //
  })
};
</script>
