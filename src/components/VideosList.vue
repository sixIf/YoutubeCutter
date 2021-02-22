<template>
    <v-card elevation="8" class="grayTwo" height="520">
        <v-container fluid no-gutters>
            <v-row justify="end">
                <!-- <v-col v-if="videoList.length != 0" cols="2" max-height="50px">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                fab
                                small
                                @click="clearList()"
                                v-on="on"
                                v-bind="attrs"
                            >
                                <v-icon class="theme--light">mdi-delete</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t('videoList.clear') }}</span> 
                    </v-tooltip>
                </v-col> -->
                <v-col cols="12">
                    <v-virtual-scroll
                        :items="videoList"
                        :item-height="120"
                        :bench="benched"
                        class="no-x-scroll grayThree"
                        height="500"
                    >
                        <template v-slot:default="{ item }">
                            <v-list-item :key="item.id" :value="item.id" :class="computeItemClass(item)">
                                <v-list-item-avatar :tile="true" width="150" height="100" @click="selectVideo(item)" style="cursor: pointer">
                                    <v-img :src="item.thumbnail"/>
                                </v-list-item-avatar>
                                <v-list-item-title>
                                    <v-row align="center" style="height: 100px; cursor: pointer" @click="selectVideo(item)">
                                        <v-col cols="12">{{item.title}}</v-col>
                                    </v-row>
                                    
                                </v-list-item-title>
                                <v-list-item-action>
                                    <v-row align="center">
                                        <v-col cols="6">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn 
                                                        icon 
                                                        @click="selectVideo(item)"
                                                        v-bind="attrs"
                                                        v-on="on"
                                                    >
                                                        <v-icon :color="computeCutColor(item)">mdi-content-cut</v-icon>
                                                    </v-btn>       
                                                    </template>
                                                <span>{{ $t('videoList.edit') }}</span>
                                            </v-tooltip>                                                                                         
                                        </v-col>
                                        <v-col cols="6">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon 
                                                        class="theme--light black--text"
                                                        @click="changeVideoToDownload(item)"
                                                        v-bind="attrs"
                                                        v-on="on"
                                                    >
                                                        {{ item.toDownload ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                                                    </v-icon>  
                                                    </template>
                                                <span>{{ getCheckboxTooltip(item) }}</span>
                                            </v-tooltip>                                                
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

    mounted() {
        if(this.videoList.length > 0 && !this.selectedVideo.id)
            this.$store.commit('fetchedVideosState/setSelectedVideo', this.videoList[0]);
    }

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

    clearList(){
        this.$store.dispatch(`fetchedVideosState/resetVideosState`);
        this.$router.push('/');
    }

    computeCutColor(video: VideoDetail){
        return this.selectedVideo.id == video.id ? 'primary' : 'grey lighten-1';
    }

    computeItemClass(video: VideoDetail){
        if(!video.toDownload){
            return "item-ignored"
        } else if (video.id == this.selectedVideo.id) {
            return "item-selected"
        } else { // default style
            return "";
        }
    }

    /**
     * Getters
     */

    getCheckboxTooltip(item: VideoDetail) {
        return item.toDownload ? this.$t('videoList.deselect')
            : this.$t('videoList.select');
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

.item-selected {
    background: var(--v-lightPrimary-base);
}
</style>