<template>
  <div>
    <nav-drawer
      :channelId="channelId"
      :channelTitle="channelTitle"
      :channelThumbnail="channelThumbnail"
    ></nav-drawer>
    <v-content>
      <v-container class="channel-container" fluid>
        <v-row align="start" justify="start" no-gutters>
          <v-col cols="12">
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import NavDrawer from "../components/NavDrawer";
import axios from "axios";

export default {
  name: "channel-dashboard-layout",
  components: {
    NavDrawer
  },

  props: {},

  data: () => ({
    /* TODO Put as props and undefined */
    channelThumbnail: undefined,
    channelTitle: undefined
  }),

  methods: {},

  computed: {
    isHome() {
      return this.$route.path === "/";
    },

    channelId() {
      return this.$route.params.id;
    }
  },

  mounted() {
    axios
      .get(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&maxResults=1",
        {
          params: {
            id: this.channelId,
            key: this.$api_key
          }
        }
      )
      .then(response => {
        let channelInfos = response.data.items[0].snippet;
        this.channelTitle = channelInfos.title;
        this.channelThumbnail = channelInfos.thumbnails.high.url;
      })
      .catch(err => {
        this.$router.push("/");
        console.log(err);
      });
  }
};
</script>
