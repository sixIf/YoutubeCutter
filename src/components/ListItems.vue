<template>
  <v-item-group multiple v-model="itemSelected">
    <v-container class="list-item-container" fluid>
      <v-row dense>
        <!-- <p v-if="itemList.length==0">No {{ itemType }} found</p> -->
        <v-col v-for="item in itemList" :key="item.id" cols="12" sm="6" lg="2">
          <v-item v-slot:default="{ active, toggle }" :value="item">
            <v-card
              :color="active ? 'primary' : ''"
              id="item.id"
              hover
              @click="if(clickEnabled) {toggle(); $emit('update-list', itemSelected)}"
            >
              <v-img
                :src="item.thumbnail"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-btn v-if="clickEnabled" class="fav-icon" icon dark>
                  <v-icon>{{ active ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}</v-icon>
                </v-btn>
                <v-card-title class="item-name" v-text="item.title"></v-card-title>
              </v-img>
              <v-card-actions>
                <v-spacer>
                  <v-btn
                    :to="{name: 'playlist-videos', params: { playlistId: item.id, playlistName: item.title }}"
                    v-if="itemType=='playlist'"
                    color="primary"
                  >
                    <v-icon>location-enter</v-icon>Explore
                  </v-btn>
                </v-spacer>
              </v-card-actions>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { ItemStruct, VideoSelected } from "@/config/litterals";

@Component
export default class ListItems extends Vue {
  @Prop({ default: "video" }) itemType!: string;
  @Prop(Array) itemList: ItemStruct[] | undefined;
  @Prop({ default: true }) clickEnabled!: boolean;

  itemSelected: Array<ItemStruct> | null = [];

  @Watch("itemSelected", { immediate: true, deep: true })
  onItemListChanged() {
    this.$emit("update-selected", this.itemSelected);
  }

  // scrollFetchVideos(): void {
  //   window.onscroll = () => {
  //     const bottomOfWindow =
  //       Math.max(
  //         window.pageYOffset,
  //         document.documentElement.scrollTop,
  //         document.body.scrollTop
  //       ) +
  //         window.innerHeight ===
  //       document.documentElement.offsetHeight;

  //     if (bottomOfWindow) {
  //       this.$emit("more-items");
  //     }
  //   };
  // }

  mounted() {
    // Init scroll
    // this.scrollFetchVideos();
  }
}
</script>

<style lang="stylus">
.fav-icon
  position absolute
  top 5px
</style>