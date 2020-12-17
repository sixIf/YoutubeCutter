<template>
    <v-card min-width="100%" height="100%">
        <v-container class="search-toolbar">
            <v-row>
                <v-col cols="12">
                    <v-card-title>{{$__('Toolbar.search')}}</v-card-title>
                    <v-divider></v-divider>
                    <alert :alert="alert"></alert>
                    <v-card-actions>
                        <v-form style="width: 100%" v-on:submit.prevent>
                            <v-text-field
                                class="video-list"
                                append-outer-icon="mdi-send"
                                hint="https://www.youtube.com/watch?v=jNQXAC9IVRw"
                                outlined
                                v-model="videoUrl"
                                label="Video URL"
                                @click:append-outer="findVideo"
                                @keydown.enter="findVideo"
                                full-width
                                required
                            ></v-text-field>
                        </v-form>
                    </v-card-actions>
                    <v-card-text>
                        <v-list
                            v-for="(video, index) in videosFetched"
                            :key="video.id"
                        >
                            <v-list-item>
                                <template v-slot:default>
                                    <v-list-item-action>
                                        <v-icon @click="removeVideo(index)"
                                            >mdi-delete</v-icon
                                        >
                                    </v-list-item-action>

                                    <v-list-item-content>
                                        <v-list-item-title>{{
                                            video.title
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import { Component, Inject, Watch, Vue, Prop } from "vue-property-decorator";
import {
    YOUTUBE_SERVICE,
    ItemStruct,
    ERROR_TYPES,
    IAlert,
    API_KEY_SERVICE,
} from "@/config/litterals";
import Alert from "@/components/Alert.vue";
import { IYoutubeService } from "@/services/youtubeService";
import { IApiKeyService } from '@/services/apiKeyService';

@Component({
    components: {
        Alert,
    },
})
export default class SearchVideosToolbar extends Vue {
    @Inject(YOUTUBE_SERVICE)
    youtubeService!: IYoutubeService;
    @Inject(API_KEY_SERVICE)
    apiKeyService!: IApiKeyService;

    @Prop({ default: false }) emptyToolbar!: boolean;
    videoUrl = "";
    videosFetched: ItemStruct[] = [];
    alert: IAlert | null = null;
    searchType = "video";

    get videoId(): string {
        return this.youtubeService.extractVideoIdFromUrl(this.videoUrl);
    }
    removeVideo(index: number) {
        this.videosFetched.splice(index, 1);
    }

    findVideo() {
        if (this.apiKeyService.getApiKey()) this.findVideoApi();
        else this.findVideoNoApi();
    }

    async findVideoNoApi() {
        this.alert = null;
        const VIDEO_ID = this.videoId;
        try {
            const response = await window.myIpcRenderer.invoke("getVideoInfo", VIDEO_ID)
            if (response.type == 'error'){
                // handle error
                this.alert = {
                    type: "error",
                    message: this.$__("Toolbar.notFound"),
                };
            }
            else {
                const thumbnail = response.videoDetails.thumbnail.thumbnails[response.videoDetails.thumbnail.thumbnails.length -1];
                this.videosFetched.push({
                    id: VIDEO_ID,
                    title: response.videoDetails.title,
                    thumbnail: thumbnail ? thumbnail.url : ""
                })
                this.videoUrl = "";
            }
        } catch (err) {
            window.log.info(err)
        }        
    }

    async findVideoApi() {
        this.alert = null;
        if (this.videosFetched.findIndex((x) => x.id == this.videoId) == -1) {
            try {
                const response = await this.youtubeService.findVideoById(
                    this.videoId
                );
                if (response.totalResults == 0) {
                    this.alert = {
                        type: "error",
                        message: this.$__("Toolbar.notFound"),
                    };
                } else {
                    this.videosFetched.push(response.videoInfos);
                    this.videoUrl = "";
                }
            } catch (error) {
                window.log.info("Catch error " + error.message);
                this.alert = {
                    type: "error",
                    message: this.$__(`Errors.${ERROR_TYPES[error.response.status]}`),
                };
            }
        } else {
            this.alert = {
                type: "error",
                message: this.$__("Toolbar.duplicateVideo"),
            };
        }
    }

    mounted(){
        if (this.$route.params.videoID) {
            this.videoUrl = `https://www.youtube.com/watch?v=${this.$route.params.videoID}`;
            this.findVideoNoApi();
        }
        window.myIpcRenderer.receive(
            "add-single-video",
            (videoID: string) => {
                this.videoUrl = `https://www.youtube.com/watch?v=${videoID}`;
                this.findVideoNoApi();
            }
        )        
    }

    @Watch("videosFetched")
    onVideoFetchedChanged(val: ItemStruct[], oldVal: ItemStruct[]) {
        this.$emit("update-video-list", val);
    }

    @Watch("emptyToolbar")
    onEmptyToolbarChanged(val: boolean, oldVal: boolean) {
        if (val) this.videosFetched = [];
    }
}
</script>

<style lang="stylus">

.video-list
  width 90%
  // margin-bottom 15px

.search-toolbar
  min-height 500px  
</style>