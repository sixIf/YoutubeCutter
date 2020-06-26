<template>
  <v-content>
    <v-container class="home-container fill-height" fluid>
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="4" lg="4">
          <v-card class="mx-auto my-12" max-width="374">
            <v-img height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>

            <v-card-title>Explore a specific Youtube channel</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0"></v-row>

              <div>You can find and download all the videos in a channel, navigating through playlists.</div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-actions>
              <v-btn color="primary" text :to="{name: 'search-channel'}">Let's go</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="4" lg="4" offset="1" offset-md="0">
          <v-card class="mx-auto my-12" max-width="374">
            <v-img height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>

            <v-card-title>Choose video by URLs</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0"></v-row>

              <div>You can find and download up to 10 videos simulteanously by copying and pasting their URLs.</div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-actions>
              <v-btn color="primary" text :to="{name: 'search-videos'}">Let's go</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Inject, Provide, Vue } from "vue-property-decorator";

// Define the component in class-style
@Component
export default class Home extends Vue {}
</script>
