<template>
  <v-app>
    <div>
      <v-snackbar v-model="snackbar" top color="info">
        {{ snackbarMessage }}
        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
      <v-app-bar color="primary" style="z-index: 50" app dense dark>
        <router-link to="/">
          <v-btn icon>
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </router-link>
        <v-toolbar-title>Youtube Downloader</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon v-if="isDownloading">
          <v-icon>mdi-download-circle</v-icon>
        </v-btn>
        <router-link to="/help">
          <v-btn icon>
            <v-icon>mdi-help-circle</v-icon>
          </v-btn>
        </router-link>
        <h1 style="color: white;">{{messageReceived}}</h1>
        <router-link to="/api-key">
          <v-btn icon>
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </router-link>
      </v-app-bar>
    </div>
    <router-view />
    <download-queue-modal v-if="isDownloading" />
  </v-app>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DownloadQueueModal from "@/components/DownloadQueueModal.vue";
const { myIpcRenderer } = window;

// Define the component in class-style
@Component({
  components: {
    DownloadQueueModal
  }
})
export default class App extends Vue {
  messageReceived = "";
  isDownloading = false;
  snackbar = false;
  snackbarMessage = "";

  sendMessage() {
    window.myIpcRenderer.send("do-a-thing", { a: "ok" });
  }
  mounted() {
    console.log("Mounted");
    window.myIpcRenderer.receive("it-is-good", (data: any) => {
      this.messageReceived = data;
      console.log(`Received ${data} from main process`);
    });

    window.myIpcRenderer.receive("download-started", (data: any) => {
      this.isDownloading = true;
      this.snackbarMessage = "Download started !";
      this.snackbar = true;
      console.log("Behold, download started");
    });
  }
}
</script>