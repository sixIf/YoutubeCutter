<template>
  <v-dialog v-if="isDownloading" v-model="dialog" max-width="500">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="primary" id="download-queue">See Download Queue</v-btn>
    </template>
    <slot></slot>
    <v-card>
      <v-card-title class="headline">Download queue</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-list v-for="(infos, index) in videoDownloading" :key="infos.video.id">
                <v-list-item>
                  <template v-slot:default>
                    <v-list-item-content>
                      <v-list-item-title>{{infos.video.title}}</v-list-item-title>
                      <v-list-item-subtitle>{{infos.progress}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon @click="removeVideo(index)">mdi-delete</v-icon>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Provide, Prop, Vue } from "vue-property-decorator";
import {
  YOUTUBESERVICE,
  ItemStruct,
  ItemDownloading,
  ERROR_TYPES
} from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
const { myIpcRenderer } = window;

@Component
export default class DownloadQueueModal extends Vue {
  dialog = false;
  nbItemToDownload = 0;
  videoDownloading: Array<ItemDownloading> = [];
  removeVideo() {
    console.log("To implement");
  }
  mounted() {
    window.myIpcRenderer.receive(
      "download-progress",
      (data: ItemDownloading) => {
        const index = this.videoDownloading.findIndex(
          x => x.video.id === data.video.id
        );
        if (index == -1) this.videoDownloading.push(data);
        else this.videoDownloading[index].progress = data.progress;
        console.log("Update progress");
      }
    );

    window.myIpcRenderer.receive("download-started", (data: number) => {
      this.nbItemToDownload += data;
      console.log("Behold, download started");
    });

    /**
     * TODO : Add a status on item list to track if item is downloading or finished
     * Fire event on download finished wich will increment the nbItemDownloadedValue
     *  Whane nbItemDownloadValue is equal to nbItemToDownload, Display snackbar download finished
     * and hide button
     *
     * Lets see if we put the download list in a dismissible panel to the left / bottom ?
     */
  }
}
</script>

<style lang="stylus">
#download-queue
  position fixed
  z-index 100
  bottom 8px
  right  50px
  background: linear-gradient(270deg, #d32f2f, #f1c40f, #eaebed, #b0daf1, #2274a5, #2274a5, #b0daf1, #eaebed, #f1c40f, #d32f2f);
  background-size: 400% 400%;
  -webkit-animation: QueueButton 3s ease infinite;
  -moz-animation: QueueButton 3s ease infinite;
  -o-animation: QueueButton 3s ease infinite;
  animation: QueueButton 3s ease infinite;

</style>

<style>
@-webkit-keyframes QueueButton {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-moz-keyframes QueueButton {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-o-keyframes QueueButton {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes QueueButton {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>