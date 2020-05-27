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
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import NavDrawer from "../components/NavDrawer";

export default {
  name: "channel-dashboard-layout",
  components: {
    NavDrawer
  },

  props: {},

  data: () => ({
    /* TODO Put as props and undefined */
    channelId: "UChKMRHxLETrj_5JjiqExD1w",
    channelThumbnail:
      "https://yt3.ggpht.com/-kuwqOm6qy04/AAAAAAAAAAI/AAAAAAAAAAA/knXSxLuA1mU/s800-c-k-no-mo-rj-c0xffffff/photo.jpg",
    channelTitle: "Kemar"
  }),

  methods: {},

  computed: {
    isHome() {
      return this.$route.path === "/";
    }
  },

  mounted() {
    this.$on("channel-infos", function(
      channelId,
      channelTitle,
      channelThumbnail
    ) {
      this.channelId = channelId;
      this.channelTitle = channelTitle;
      this.channelThumbnail = channelThumbnail;
    });
  }
};
</script>
