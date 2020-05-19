<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <search-channel-videos />
  </div>
</template>

<script>
// @ is an alias to /src
import SearchChannelVideos from "@/components/SearchChannelVideos.vue";

export default {
  name: "Home",
  components: {
    SearchChannelVideos
  }
};
</script>
