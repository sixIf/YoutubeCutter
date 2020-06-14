<template>
  <div>
    <v-container class="list-item-container" fluid>
      <v-row dense>
        <p v-if="!itemList">No {{ itemType }} found</p>
        <v-col v-for="item in itemList" :key="item.id" cols="2">
          <v-card @click="clickAction(item.id)">
            <v-img
              :src="item.thumbnail"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="item.title"></v-card-title>
            </v-img>

            <v-card-actions>
              <v-spacer></v-spacer>
              <download-modal :itemId="item.id">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon>
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </template>
              </download-modal>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ItemStruct } from "@/config/litterals";
import DownloadModal from "@/components/DownloadModal.vue";

@Component({
  components: { DownloadModal }
})
export default class ListItems extends Vue {
  @Prop(String) itemType: string | null = null;
  @Prop(Array) itemList: ItemStruct[] | undefined;

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