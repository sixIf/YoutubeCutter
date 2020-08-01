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
        <router-link to="/api-key">
          <v-btn icon>
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </router-link>
      </v-app-bar>
      <download-queue-drawer />
    </div>
    <router-view />
  </v-app>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DownloadQueueDrawer from "@/components/DownloadQueueDrawer.vue";
const { myIpcRenderer } = window;

// Define the component in class-style
@Component({
  components: {
    DownloadQueueDrawer,
  },
})
export default class App extends Vue {
  isDownloading = false;
  snackbar = false;
  snackbarMessage = "";

  mounted() {
    // window.myIpcRenderer.receive("download-started", (data: any) => {
    //   this.isDownloading = true;
    //   this.snackbarMessage = "Download started !";
    //   this.snackbar = true;
    //   console.log("Behold, download started");
    // });
  }
}
</script>