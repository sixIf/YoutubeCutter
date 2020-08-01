<template>
  <channel-videos></channel-videos>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import ChannelVideos from "@/views/ChannelVideos.vue";

@Component({
  components: {
    ChannelVideos,
  },
})
export default class PlaylistVideos extends Vue {
  get playlistTitle(): string {
    return this.$route.params.playlistTitle;
  }
}
</script>