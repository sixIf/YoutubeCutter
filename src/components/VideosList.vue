<template>
    <v-container fluid no-gutters style="height: 100%">
        <v-row justify="end" style="height: 100%">
            <v-col cols="12" class="flex-column-no-wrap">
                <v-virtual-scroll
                    :items="videoList"
                    :item-height="120"
                    :bench="benched"
                    max-height="100%"
                    class="no-x-scroll grayThree"
                    style="flex: 1 0 0"
                >
                    <template v-slot:default="{ item }">
                        <v-list-item :key="item.id" :value="item.id" :class="computeItemClass(item)">
                            <v-list-item-avatar :tile="true" width="150" height="100" @click="selectVideo(item)" style="cursor: pointer">
                                <v-img :src="item.thumbnail"/>
                            </v-list-item-avatar>
                            <v-list-item-title>
                            <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-row align="center" 
                                                style="height: 100px; cursor: pointer" 
                                                @click="selectVideo(item)"
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <v-col cols="12"><h3>{{item.title}}</h3></v-col>
                                                <v-col cols="12">{{getCutInsight(item)}}</v-col>
                                            </v-row>
                                            </template>
                                        <span>{{ item.title }}</span>
                                    </v-tooltip>   
                                
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
</template>

<script lang="ts">
import { VideoDetail } from "@/config/litterals";
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
            this.selectVideo(this.videoList[0]);
    }

    @Watch('videoList')
    onVideoListChanged(newList: VideoDetail[]){
        if(newList.length > 0 && !this.selectedVideo.id)
            this.selectVideo(newList[0]);
    }

    selectVideo(video: VideoDetail){
        this.$store.dispatch('fetchedVideosState/setSelectedVideo', video);
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

    getCutInsight(item: VideoDetail): string {
        let insight = "";
        const fullSlice = item.sliceList[0];
        if (fullSlice.isActive) insight += '| ' + this.$t(`videoList.${fullSlice.format.type}`) + ' ';
        if (item.sliceList.length > 1) insight += '| ' + this.$tc('videoList.slice', item.sliceList.length-1, { nb: item.sliceList.length-1 })
        return insight;
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