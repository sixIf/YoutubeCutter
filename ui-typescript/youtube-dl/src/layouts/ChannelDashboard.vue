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

<script lang="ts">
import NavDrawer from "@/components/NavDrawer.vue";
import { Component, Inject, Vue } from "vue-property-decorator";
import { YOUTUBESERVICE, ERROR_TYPES } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";

@Component({
  components: { NavDrawer }
})
export default class ChannelDashboard extends Vue {
  @Inject(YOUTUBESERVICE)
  service!: IYoutubeService;

  channelThumbnail: string | null = null;
  channelTitle: string | null = null;

  get channelId(): string {
    return this.$route.params.id;
  }

  async mounted() {
    try {
      const response = await this.service.findChannelById(this.channelId);
      this.channelTitle = response.title;
      this.channelThumbnail = response.thumbnail;
    } catch (err) {
      this.$router.push("/");
      console.log(err);
    }
  }
}
</script>