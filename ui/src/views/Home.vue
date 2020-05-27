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

<script>
import SearchChannel from "../components/SearchChannel";

export default {
  name: "home",

  components: {
    SearchChannel
  }
};
</script>
