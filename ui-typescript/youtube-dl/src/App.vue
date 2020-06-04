<template>
  <v-app>
    <router-view />
  </v-app>
</template>



<script lang="ts">
import { Component, Inject, Provide, Vue } from "vue-property-decorator";
import { YOUTUBESERVICE } from "@/config/litterals";
import { IYoutubeService } from "./api/youtube";

// Define the component in class-style
@Component({})
export default class App extends Vue {
  // Class properties will be component data

  @Inject(YOUTUBESERVICE)
  service!: IYoutubeService;
  count = 0;

  // Methods will be component methods
  mounted() {
    console.log(this.service);
  }
}
</script>
