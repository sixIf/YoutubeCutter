<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
  inject: ["youtubeService"],
  components: {},

  data: () => ({}),

  methods: {
    async fetchVideos() {
      try {
        const response = await this.youtubeService.findChannelById(
          this.$api_key,
          "UChKMRHxLETrj_5JjiqExD1w"
        );
      } catch {
        //
      }
    }
  },

  computed: {},

  mounted() {
    fetchVideos();
  }
};
</script>
