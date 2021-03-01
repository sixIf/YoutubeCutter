<template>
      <v-list-group
        :value="true"
        :prepend-icon="headerIcon"
        color="primary"
        active-class="lightPrimary"
      >
        <template v-slot:activator>
          <v-list-item-title ><h2>{{ headerTitle }}</h2></v-list-item-title>    
        </template>
            <v-virtual-scroll
                :items="items"
                :item-height="itemHeight"
                :height="virtualScrollHeight"
                class="no-x-scroll grayThree"
            >
                <template v-slot:default="{ item, index }">
                    <v-list-item :key="item.id" :value="item.id">
                        <v-list-item-title class="pl-5">{{ index+1 + '. ' + item.title }}</v-list-item-title>
                        <v-list-item-action>
                            <slot name="actionBtns"
                                v-bind:item="item" 
                                v-bind:index="index" 
                            ></slot>
                        </v-list-item-action>
                    </v-list-item>
                    <v-divider></v-divider>
                </template>
            </v-virtual-scroll>
      </v-list-group>   
</template>

<script lang="ts">
import { VideoDetail } from "@/config/litterals";
import { QueueLists } from "@/store/downloadQueueState/types";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class  extends Vue {
    @Prop({ default: ""}) headerIcon!: string;
    @Prop({ default: ""}) headerTitle!: string;
    @Prop({ default: "downloading"}) type!: QueueLists;
    @Prop({ default: () => {
            return []
        }
    }) items!: VideoDetail[];
    itemHeight = 50;

    get virtualScrollHeight(): number {
        return Math.min(this.itemHeight * 15, this.itemHeight * this.items.length);
    }
}
</script>
<style>
.no-x-scroll {
    overflow-x: hidden !important;
}
</style>