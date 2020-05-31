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


<script>
import DownloadModal from "../components/DownloadModal";
import axios from "axios";
export default {
  name: "list-items",

  components: { DownloadModal },
  props: {
    itemList: undefined,
    itemType: {
      type: String
    }
  },
  data: () => ({}),

  methods: {
    scrollFetchVideos() {
      window.onscroll = () => {
        let bottomOfWindow =
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
    },
    downloadSingleVideo(item) {},
    clickAction(itemId) {
      switch (this.itemType) {
        case "playlist":
          this.$emit("item-clicked", itemId);
          break;
        case "video":
          break;
      }
    }
  },

  mounted() {
    // Init scroll
    this.scrollFetchVideos();
  }
};
</script>