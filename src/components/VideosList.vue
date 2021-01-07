<template>
    <v-card elevation="8" class="card" height="500">
        <v-container no-gutters>
            <v-row>
                <v-col cols="12">
                    <v-list>
                        <v-list-item-group v-model="selectedVideoId" mandatory active-class="pink--text">
                            <template v-for="video in videoList">
                                <v-list-item :key="video.id" :value="video.id">
                                    <v-list-item-avatar :tile="true" width="150" height="100">
                                        <v-img :src="video.thumbnail"/>
                                    </v-list-item-avatar>
                                    <v-list-item-title>{{video.title}}</v-list-item-title>
                                    <v-list-item-action></v-list-item-action>
                                </v-list-item>
                            </template>
                        </v-list-item-group>
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
    @Prop({ default: () => {
        return []
    }}) videoList!: VideoDetail[];
    @Getter('fetchedVideosState/getSelectedVideo') selectedVideo!: VideoDetail;
    selectedVideoId = "";

    @Watch('selectedVideo')
    onSelectedVideoChanged(newVideo: VideoDetail){
        this.selectedVideoId = newVideo ? newVideo.id : '';
    }

    @Watch('selectedVideoId')
    onVideoSelectedChanged(newVideoId: string){
        const newVideo = _.find(this.videoList, (video) => {
            return video.id == newVideoId
        })
        if (newVideoId != this.selectedVideo.id && newVideo) {
            this.$store.commit('fetchedVideosState/setSelectedVideo', newVideo);
        } 
    }
}
</script>