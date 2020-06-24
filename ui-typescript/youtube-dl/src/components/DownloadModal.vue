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
            <v-col cols="12" sm="6" md="4">
              <v-select v-model="quality" :items="qualityTypes" label="Quality"></v-select>
            </v-col>
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
import { Component, Provide, Prop, Vue } from "vue-property-decorator";
import { YOUTUBESERVICE, ERROR_TYPES } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";

@Component
export default class DownloadModal extends Vue {
  @Prop({ default: true }) disabled!: boolean;
  @Prop(Array) itemsSelected: string[] = [];
  @Prop({ default: "video" }) itemType!: string;
  dialog = false;
  audioOnly = false;
  quality: string | null = null;
  qualityTypes = ["high", "medium", "low"];

  downloadItems(): void {
    switch (this.itemType) {
      case "video":
        // Send videos array of json
        break;

      case "playlist":
        // Send playlist array of Json
        break;
    }
  }
}
</script>