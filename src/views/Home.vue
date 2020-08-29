<template>
  <v-main>
    <v-container class="home-container fill-height" fluid>
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="4" lg="4">
          <v-card elevation="15" min-height="200" class="mx-auto my-12" max-width="374">
            <v-card-title>Explore a Youtube channel</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0"></v-row>

              <div>Display all the videos and playlists uploaded to a channel. Choose what you want to download.</div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-actions>
              <v-btn color="primary" text :to="{name: 'search-channel'}">Let's go</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="4" lg="4" offset="1" offset-md="1">
          <v-card elevation="15" min-height="200" class="mx-auto my-12" max-width="374">
            <v-card-title>Choose video by URLs</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0"></v-row>

              <div>Find and download the videos of your choice by copying and pasting their URLs.</div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-actions>
              <v-btn color="primary" text :to="{name: 'search-videos'}">Let's go</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from "vue-property-decorator";

// Define the component in class-style
@Component
export default class Home extends Vue {}
</script>
