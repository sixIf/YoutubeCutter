<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" :disabled="disabled" color="primary">Download</v-btn>
    </template>
    <slot></slot>
    <v-card>
      <v-card-title class="headline">Download options</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-switch v-model="audioOnly" label="Audio only"></v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="downloadItems">Download</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import {
  YOUTUBESERVICE,
  ItemStruct,
  ERROR_TYPES,
  DownloadRequest,
} from "@/config/litterals";
import * as _ from "lodash";
import { IYoutubeService } from "@/services/youtubeService";
const { myIpcRenderer } = window;

@Component
export default class DownloadVideosModal extends Vue {
  @Inject(YOUTUBESERVICE)
  service!: IYoutubeService;

  @Prop({ default: true }) disabled!: boolean;
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  videosSelected!: ItemStruct[];
  dialog = false;
  audioOnly = false;

  get channelTitle(): string {
    return this.$route.params.hasOwnProperty("channelTitle")
      ? this.$route.params.channelTitle
      : "Vrac";
  }

  get playlistTitle(): string {
    return this.$route.params.playlistTitle
      ? this.$route.params.playlistTitle
      : "";
  }

  downloadItems(): void {
    console.log(`channel title ${this.channelTitle}`);
    const downloadRequest: DownloadRequest = {
      audioOnly: this.audioOnly,
      playlistTitle: this.playlistTitle,
      channelTitle: this.channelTitle,
      itemSelected: this.videosSelected,
    };

    window.myIpcRenderer.send("download-videos", downloadRequest);
    this.dialog = false;
    this.$emit("download-started");
  }
}
</script>