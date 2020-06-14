<template>
  <v-app>
    <div>
      <v-app-bar color="primary" dense dark>
        <router-link to="/">
          <v-btn icon>
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </router-link>
        <v-toolbar-title>Youtube Downloader</v-toolbar-title>
        <v-spacer></v-spacer>
        <router-link to="/apiKey">
          <router-link to="/">
            <v-btn icon>
              <v-icon>mdi-help-circle</v-icon>
            </v-btn>
          </router-link>
          <v-btn icon>
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </router-link>
      </v-app-bar>
    </div>
    <router-view />
  </v-app>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

// Define the component in class-style
@Component({})
export default class App extends Vue {}
</script>
