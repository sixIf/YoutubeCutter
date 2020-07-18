<template>
  <div>
    <v-btn
      v-if="isDownloading"
      color="pink"
      dark
      id="download-queue"
      @click.stop="drawer = !drawer"
    >See download queue</v-btn>
    <v-navigation-drawer v-model="drawer" absolute right temporary width="500" style="z-index: 101">
      <v-list-item>
        <v-list-item-content>
          <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
            <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
          </v-tabs>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <!-- TODO merge 2 tabs in a component -->
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-list v-for="(infos) in videoDownloading" :key="infos.video.id">
            <v-list-item>
              <template v-slot:default>
                <v-list-item-content>
                  <v-list-item-title>{{infos.video.title}}</v-list-item-title>
                  <v-list-item-subtitle
                    style="padding-left: 10px"
                  >1. Downloading audio {{infos.progressAudio}}%</v-list-item-subtitle>
                  <div v-if="!infos.audioOnly">
                    <v-list-item-subtitle
                      style="padding-left: 10px"
                    >2. Downloading video {{infos.progressVideo}}%</v-list-item-subtitle>
                  </div>
                </v-list-item-content>
                <v-list-item-action>
                  <v-progress-circular indeterminate color="primary" />
                  <!-- <v-icon @click="removeVideo(index)">mdi-delete</v-icon> -->
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
        </v-tab-item>
        <v-tab-item>
          <v-btn
            style="position: fixed; bottom: 5px; right: 20px"
            @click="clearDownloadedList"
          >Clear list</v-btn>
          <v-list v-for="(infos) in videoDownloaded" :key="infos.video.id">
            <v-list-item>
              <template v-slot:default>
                <v-list-item-content>
                  <v-list-item-title>{{infos.video.title}}</v-list-item-title>
                </v-list-item-content>
                <!-- <v-list-item-action>
                  <v-icon @click="removeVideo(index)">mdi-delete</v-icon>
                </v-list-item-action>-->
              </template>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Prop, Vue } from "vue-property-decorator";
import * as _ from "lodash";
import {
  YOUTUBESERVICE,
  ItemStruct,
  ItemDownloading,
  ERROR_TYPES
} from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
const { myIpcRenderer } = window;

@Component
export default class DownloadQueueDrawer extends Vue {
  dialog = false;
  isDownloading = true;
  drawer = null;
  tab = null;
  tabs = ["Downloading", "Finished"];
  videoDownloading: Array<ItemDownloading> = [
    {
      progressAudio: "100.00",
      progressVideo: "0",
      type: "video",
      audioOnly: false,
      video: {
        id: "w3_paCEqWxo",
        thumbnail: "https://i.ytimg.com/vi/w3_paCEqWxo/hqdefault.jpg",
        title:
          "Composition en rouge, bleu et blanc II | Piet Mondrian | Centre Pompidou"
      }
    },
    {
      progressAudio: "100.00",
      progressVideo: "0",
      type: "audio",
      audioOnly: true,
      video: {
        id: "q2awCruG7UI",
        thumbnail: "https://i.ytimg.com/vi/q2awCruG7UI/hqdefault.jpg",
        title:
          "1- Les débuts de la photographie - La naissance d’une invention (1/4)"
      }
    }
  ];
  videoDownloaded: Array<ItemDownloading> = [
    {
      progressAudio: "100.00",
      progressVideo: "0",
      type: "audio",
      audioOnly: true,
      video: {
        id: "w3_paCEqWxo",
        thumbnail: "https://i.ytimg.com/vi/w3_paCEqWxo/hqdefault.jpg",
        title:
          "Composition en rouge, bleu et blanc II | Piet Mondrian | Centre Pompidou"
      }
    },
    {
      progressAudio: "100.00",
      progressVideo: "0",
      type: "audio",
      audioOnly: true,
      video: {
        id: "q2awCruG7UI",
        thumbnail: "https://i.ytimg.com/vi/q2awCruG7UI/hqdefault.jpg",
        title:
          "1- Les débuts de la photographie - La naissance d’une invention (1/4)"
      }
    }
  ];
  removeVideo() {
    console.log("To implement");
  }
  clearDownloadedList() {
    _.remove(this.videoDownloaded, function(x) {
      return true;
    });
  }
  mounted() {
    window.myIpcRenderer.receive(
      "download-progress",
      (data: ItemDownloading) => {
        this.isDownloading = true; // that way even when page refreshed the download list is populated
        const index = this.videoDownloading.findIndex(
          x => x.video.id === data.video.id
        );
        if (index == -1) this.videoDownloading.push(data);
        else {
          if (data.type == "audio")
            this.videoDownloading[index].progressAudio = data.progressAudio;
          else this.videoDownloading[index].progressVideo = data.progressVideo;
        }
        console.log("Update progress");
      }
    );

    window.myIpcRenderer.receive("download-started", (data: number) => {
      // this.nbItemToDownload += data;
      console.log("Behold, download started");
    });

    window.myIpcRenderer.receive("item-downloaded", (data: string) => {
      const indexToDelete = _.findIndex(this.videoDownloading, function(x) {
        return x.video.id === data;
      });
      console.log(`Index found ${indexToDelete}`);
      console.log();
      // LODASH ShOULD HANDLE THE COPY BETWEEN ARRAYS
      if (indexToDelete != -1) {
        this.videoDownloaded.push(
          _.cloneDeep(this.videoDownloading[indexToDelete])
        );
        _.remove(this.videoDownloading, function(
          value: ItemDownloading,
          index: number
        ) {
          return index == indexToDelete;
        });
        console.log(`Behold, video with id ${data} downloaded`);
      }
    });

    /**
     * TODO : Add a status on item list to track if item is downloading or finished
     * Fire event on download finished wich will increment the nbItemDownloadedValue
     *  When nbItemDownloadValue is equal to nbItemToDownload, Display snackbar download finished
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