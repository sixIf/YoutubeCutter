<template>
  <v-navigation-drawer app color="primary" permanent dark>
    <v-list dense nav class="py-0">
      <v-list-item align="center" two-line :class="'px-0'">
        <v-list-item-avatar>
          <img :src="channelThumbnail" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{channelTitle}}</v-list-item-title>
          <v-list-item-subtitle>{{channelId}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item v-for="item in items" :key="item.title" :to="item.link" exact link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import axios from "axios";
export default {
  name: "nav-drawer",

  components: {},

  props: {
    channelId: "",
    channelTitle: undefined,
    channelThumbnail: undefined
  },

  data() {
    return {
      items: [
        {
          title: "Videos",
          icon: "mdi-video-box",
          link: { name: "channel-videos" }
        },
        {
          title: "Playlists",
          icon: "mdi-playlist-play",
          link: { name: "channel-playlists" }
        },
        {
          title: "About",
          icon: "mdi-help-box",
          link: { name: "channel-about" }
        },
        {
          title: "Exit channel",
          icon: "mdi-exit-run",
          link: { name: "home" }
        }
      ],
      permanent: true
    };
  }
};
</script>