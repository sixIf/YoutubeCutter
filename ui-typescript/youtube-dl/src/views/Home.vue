<template>
  <v-content>
    <v-container class="home-container fill-height" fluid>
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="12" sm="8" md="4">
          <search-channel></search-channel>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Inject, Provide, Vue } from "vue-property-decorator";
import SearchChannel from "@/components/SearchChannel.vue";

// Define the component in class-style
@Component({
  components: { SearchChannel }
})
export default class Home extends Vue {}
</script>
