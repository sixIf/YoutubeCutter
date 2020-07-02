<template>
  <v-navigation-drawer style="z-index: 20;" app color="primary" permanent dark>
    <v-list dense nav class="py-0">
      <v-list-item align="center" two-line :class="'px-0'">
        <v-list-item-avatar>
          <img :src="channelThumbnail" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{channelTitle}}</v-list-item-title>
          <v-list-item-subtitle>{{channelId}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item v-for="item in items" :key="item.title" :to="item.link" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>



<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

interface MenusItems {
  title: string;
  icon: string;
  link: { name: string; params?: { playlistId: string | undefined } };
}

@Component
export default class NavDrawer extends Vue {
  @Prop({ default: "" }) readonly channelId!: string;
  @Prop(String) readonly channelTitle: string | undefined;
  @Prop(String) readonly channelThumbnail: string | undefined;
  @Prop({ default: "" }) readonly mainPlaylistId!: string;

  items: MenusItems[] = [
    {
      title: "Videos",
      icon: "mdi-video-box",
      link: {
        name: "channel-uploaded-videos",
        params: { playlistId: this.mainPlaylistId }
      }
    },
    {
      title: "Playlists",
      icon: "mdi-playlist-play",
      link: { name: "channel-playlists" }
    },
    {
      title: "Exit channel",
      icon: "mdi-exit-run",
      link: { name: "exit" }
    }
  ];
}
</script>