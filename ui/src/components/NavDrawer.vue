<template>
  <v-navigation-drawer app color="primary" permanent absolute dark>
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

      <v-list-item v-for="item in items" :key="item.title" link>
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
    channelId: ""
  },

  data() {
    return {
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard" },
        { title: "Photos", icon: "mdi-image" },
        { title: "About", icon: "mdi-help-box" }
      ],
      channelTitle: undefined,
      channelThumbnail: undefined,
      permanent: true,
      channelInfos: undefined
    };
  },

  mounted() {
    // Retrieve channel infos
    axios
      .get(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1",
        {
          params: {
            type: "channel",
            channelId: this.channelId,
            key: this.$api_key
          }
        }
      )
      .then(response => {
        let channelInfos = response.data.items[0].snippet;
        this.channelTitle = channelInfos.channelTitle;
        this.channelThumbnail = channelInfos.thumbnails.high.url;
        // this.$emit("channel-fetched", response.data.items);
      });
    console.log("Test");
  }
};
</script>