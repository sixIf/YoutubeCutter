<template>
    <!-- itemSelected to string -->
    <v-row
        id="list-items"
        @scroll="scrollFetchVideos($event)"
        style="height: 80vh; overflow-y: scroll"
    >
        <v-col>
            <v-item-group
                :multiple="itemType != 'playlist'"
                v-model="itemsIdSelected"
            >
                <v-container class="list-item-container" fluid>
                    <v-row dense>
                        <!-- <p v-if="itemList.length==0">No {{ itemType }} found</p> -->
                        <v-col
                            v-for="item in itemList"
                            :key="item.id"
                            cols="12"
                            sm="6"
                            lg="2"
                        >
                            <v-item
                                v-slot:default="{ active, toggle }"
                                :value="item.id"
                            >
                                <v-card
                                    :color="active ? 'primary' : ''"
                                    :id="item.id"
                                    hover
                                    @click="
                                        if (clickEnabled) {
                                            toggle();
                                        }
                                    "
                                >
                                    <v-img
                                        :src="item.thumbnail"
                                        class="white--text align-end"
                                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                        height="200px"
                                    >
                                        <v-btn
                                            v-if="clickEnabled"
                                            class="fav-icon"
                                            icon
                                            dark
                                        >
                                            <v-icon>{{
                                                active
                                                    ? "mdi-checkbox-marked"
                                                    : "mdi-checkbox-blank-outline"
                                            }}</v-icon>
                                        </v-btn>
                                        <v-card-title
                                            class="item-name"
                                            v-text="item.title"
                                        ></v-card-title>
                                    </v-img>
                                    <v-card-actions>
                                        <v-spacer>
                                            <v-btn
                                                :to="{
                                                    name: 'playlist-videos',
                                                    params: {
                                                        playlistId: item.id,
                                                        playlistTitle:
                                                            item.title,
                                                    },
                                                }"
                                                v-if="itemType == 'playlist'"
                                                color="primary"
                                            >
                                                <v-icon>location-enter</v-icon
                                                >Explore
                                            </v-btn>
                                        </v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-item>
                        </v-col>
                    </v-row>
                </v-container>
            </v-item-group>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { ItemStruct } from "@/config/litterals";
import _ from "lodash";

@Component
export default class ListItems extends Vue {
    @Prop({ default: "video" }) itemType!: string;
    @Prop({ default: [] }) itemList!: ItemStruct[];
    @Prop({ default: true }) clickEnabled!: boolean;

    itemsIdSelected: Array<string> | string = [];
    itemsSelected: Array<ItemStruct> = [];

    /**
     * C'est pas ouf, a chaque fois qu'on change un item on recalcule le tout...
     */
    @Watch("itemsIdSelected", { immediate: true, deep: true })
    onItemListChanged() {
        this.itemsSelected = [];
        if (typeof this.itemsIdSelected == "string") {
            const itemIdSelected = this.itemsIdSelected;
            const index = _.findIndex(this.itemList, function (x) {
                return x.id == itemIdSelected;
            });
            this.itemsSelected.push(this.itemList[index]);
        } else if (this.itemsIdSelected && this.itemsIdSelected.length > 0) {
            this.itemsIdSelected.forEach((itemId) => {
                const index = _.findIndex(this.itemList, function (x) {
                    return x.id == itemId;
                });
                this.itemsSelected.push(this.itemList[index]);
            });
        }
        this.$emit("update-list", this.itemsSelected);
    }

    scrollFetchVideos(event: EventListenerOrEventListenerObject): void {
        const elemHeight =
            document.getElementById("list-items")!.scrollHeight -
            document.getElementById("list-items")!.clientHeight;
        if (elemHeight == document.getElementById("list-items")!.scrollTop)
            this.$emit("more-items");
    }
}
</script>

<style lang="stylus">
.fav-icon
  position absolute
  top 5px
</style>