<template>
  <channel-videos :playlistName="playlistName"></channel-videos>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import ChannelVideos from "@/views/ChannelVideos.vue";

@Component({
  components: {
    ChannelVideos
  }
})
export default class PlylistVideos extends Vue {
  get playlistName(): string {
    return this.$route.params.playlistName;
  }
}
</script>