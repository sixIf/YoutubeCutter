<template>
    <v-card elevation="8" class="card lightCard" height="600">
        <v-container no-gutters>
            <v-row>
                <v-col cols="12">
                    <v-virtual-scroll
                        :items="videoList"
                        :item-height="120"
                        :bench="benched"
                        class="no-x-scroll"
                        height="550"
                    >
                        <template v-slot:default="{ item }">
                            <v-list-item :key="item.id" :value="item.id" :class="computeItemClass(item)">
                                <v-list-item-avatar :tile="true" width="150" height="100">
                                    <v-img :src="item.thumbnail"/>
                                </v-list-item-avatar>
                                <v-list-item-title>{{item.title}}</v-list-item-title>
                                <v-list-item-action>
                                    <v-row align="center">
                                        <v-col cols="6">
                                            <v-btn icon @click="selectVideo(item)">
                                                <v-icon :color="computeEyeColor(item)">mdi-eye</v-icon>
                                            </v-btn>                                            
                                        </v-col>
                                        <v-col cols="6">
                                            <v-icon 
                                                class="theme--light grey--text"
                                                @click="changeVideoToDownload(item)"
                                            >
                                                {{ item.toDownload ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                                            </v-icon>
                                        </v-col>
                                    </v-row>
                                </v-list-item-action>
                            </v-list-item>
                            <v-divider></v-divider>
                        </template>
                    </v-virtual-scroll>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import { VideoDetail } from "@/config/litterals";
import _ from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component
export default class VideosList extends Vue {
    @Prop({ 
        type: Array,
        default: () => {
            return []
    }}) videoList!: VideoDetail[];
    @Getter('fetchedVideosState/getSelectedVideo') selectedVideo!: VideoDetail;
    benched = 0;

    @Watch('videoList')
    onVideoListChanged(newList: VideoDetail[]){
        if(newList.length > 0 && !this.selectedVideo.id)
            this.$store.commit('fetchedVideosState/setSelectedVideo', newList[0]);
    }

    selectVideo(video: VideoDetail){
        this.$store.commit('fetchedVideosState/setSelectedVideo', video);
    }

    changeVideoToDownload(video: VideoDetail){
        this.$store.commit('fetchedVideosState/changeVideoToDownload', video.id);
    }

    computeEyeColor(video: VideoDetail){
        return this.selectedVideo.id == video.id ? 'primary' : 'grey lighten-1';
    }

    computeItemClass(video: VideoDetail){
        if(!video.toDownload){
            return "item-ignored"
        } else if (video.id == this.selectedVideo.id) {
            return ""
        } else { // default style
            return "";
        }
    }
}
</script>
<style>
.no-x-scroll {
    overflow-x: hidden !important;
}

.item-ignored {
    opacity: 0.5;
}
</style>