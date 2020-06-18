<template>
  <v-item-group multiple v-model="itemSelected">
    <v-container class="list-item-container" fluid>
      <v-row dense>
        <p v-if="!itemList">No {{ itemType }} found</p>
        <v-col v-for="item in itemList" :key="item.id" cols="2">
          <v-item v-slot:default="{ active, toggle }" :value="item.id">
            <v-card
              :color="active ? 'primary' : ''"
              id="item.id"
              hover
              @click="toggle; clickAction(item.id)"
            >
              <v-img
                :src="item.thumbnail"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-btn icon dark>
                  <v-icon>{{ active ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                </v-btn>
                <v-card-title v-text="item.title"></v-card-title>
              </v-img>
              <v-card-actions>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ItemStruct } from "@/config/litterals";
import DownloadModal from "@/components/DownloadModal.vue";

@Component
export default class ListItems extends Vue {
  @Prop(String) itemType: string | null = null;
  @Prop(Array) itemList: ItemStruct[] | undefined;

  itemSelected: Array<string> | null = [];

  clickAction(itemId: string): void {
    switch (this.itemType) {
      case "playlist":
        this.$emit("item-clicked", itemId);
        break;
      case "video":
        break;
    }
  }

  scrollFetchVideos(): void {
    window.onscroll = () => {
      const bottomOfWindow =
        Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop
        ) +
          window.innerHeight ===
        document.documentElement.offsetHeight;

      if (bottomOfWindow) {
        this.$emit("more-items");
      }
    };
  }

  mounted() {
    // Init scroll
    this.scrollFetchVideos();
  }
}
</script>