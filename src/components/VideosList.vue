<template>
    <v-card elevation="8" class="card" height="500">
        <v-container no-gutters>
            <v-row>
                <v-col cols="12">
                    <v-list>
                        <v-virtual-scroll
                            :items="videoList"
                            :item-height="120"
                            :bench="benched"
                            style="overflow-x: 0"
                            height="450"
                        >
                            <template v-slot:default="{ item }">
                                <v-list-item :key="item.id" :value="item.id">
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
                                                <v-checkbox v-model="item.toDownload" color="grey"></v-checkbox>
                                            </v-col>
                                        </v-row>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-divider></v-divider>
                            </template>
                        </v-virtual-scroll>
                    </v-list>
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

    computeEyeColor(video: VideoDetail){
        return this.selectedVideo.id == video.id ? 'primary' : 'grey lighten-1';
    }
}
</script>