<template>
    <v-dialog v-model="dialog" max-width="500">
        <template v-slot:activator="{ on }">
            <v-btn
                :disabled="disabled"
                v-on="on"
                color="primary"
                style="margin: 5px"
                >{{ getButtonTitle }}</v-btn
            >
        </template>
        <slot></slot>
        <v-card>
            <v-card-title class="headline">{{ getModalTitle }}</v-card-title>
            <v-card-text>
                <v-container>
                    <alert :alert="alert"></alert>
                    <v-row v-if="displayFetchButton" align="center">
                        <v-col cols="12">
                            <h3>
                                Playlist has {{ itemsInPlaylist }} videos. You
                                can fetch videos by group of
                                {{ maxItemDownloadable }}.
                            </h3>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="nextPageToken"
                                label="Page id"
                                :hint="`Keep this page code if you want to resume download at the ${this.videoList.length} th video later.`"
                                name="nextPageToken"
                                :disabled="isFetching"
                                type="text"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-btn @click="fetchVideosInPlaylist(false)" primary
                                >Fetch videos</v-btn
                            >
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-progress-linear
                            :active="isFetching"
                            color="deep-purple accent-4"
                            indeterminate
                            rounded
                            height="6"
                        ></v-progress-linear>
                        <v-col v-if="!checkVideoList || isFetching" cols="12">
                            <h2>
                                {{ videoList.length }}/{{ itemsInPlaylist }}
                                videos fetched
                            </h2>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-switch
                                v-model="audioOnly"
                                label="Audio only"
                            ></v-switch>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary darken-1" text @click="dialog = false"
                    >Cancel</v-btn
                >
                <v-btn
                    :disabled="disableDownloadButton"
                    color="green darken-1"
                    text
                    @click="downloadItems"
                    >Download</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";
import {
    ItemStruct,
    YOUTUBE_SERVICE,
    ItemFetched,
    DownloadRequest,
    IAlert,
    DOWNLOAD_ERROR_TYPES,
    DOWNLOAD_FOLDER_SERVICE,
} from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
import Alert from "@/components/Alert.vue";
import _ from "lodash";
import { IDownloadFolderService } from "@/services/downloadFolderService";
import { generateUniqueId } from "@/helpers/stringHelper";

@Component({
    components: {
        Alert,
    },
})
export default class DownloadPlaylistModal extends Vue {
    @Inject(YOUTUBE_SERVICE)
    youtubeService!: IYoutubeService;
    @Inject(DOWNLOAD_FOLDER_SERVICE)
    downloadFolderService!: IDownloadFolderService;

    @Prop({ default: false }) isMainPlaylist!: boolean;
    @Prop({ default: false }) disabled!: boolean;
    @Prop({ default: "" }) parentNextPageToken!: string;
    @Prop({
        type: Array,
        default: () => {
            return [];
        },
    })
    parentVideoList!: ItemStruct[];
    @Prop({ default: "" }) playlistId!: string;
    @Prop({ default: "" }) playlistTitle!: string;

    alert: IAlert | null = null;
    audioOnly = false;
    dialog = false;
    videoList: ItemStruct[] = [];
    itemsInPlaylist = 0;
    isFetching = false;
    nextPageToken = "";
    previousVideoListLength = 0;
    maxItemDownloadable = 1000;
    currentMaxItemLimit = this.maxItemDownloadable;

    get getModalTitle(): string {
        return this.isMainPlaylist
            ? `Download ${this.formatLongTitle(this.getChannelTitle)}'s channel`
            : `Download ${this.formatLongTitle(this.getPlaylistTitle)}`;
    }

    get getButtonTitle(): string {
        return this.isMainPlaylist ? "Download whole channel" : `Download`;
    }

    get getChannelTitle(): string {
        return this.$route.params.channelTitle;
    }

    get getPlaylistTitle(): string {
        return this.$route.params.playlistTitle
            ? this.$route.params.playlistTitle
            : this.playlistTitle;
    }

    get isParentAhead(): boolean {
        return this.videoList.length < this.parentVideoList.length;
    }

    get channelTitle(): string {
        return this.$route.params.channelTitle;
    }

    get displayFetchButton(): boolean {
        return (
            this.videoList.length != this.itemsInPlaylist &&
            this.isLargePlaylist
        );
    }

    get disableDownloadButton(): boolean {
        return (
            (this.videoList.length < this.maxItemDownloadable &&
                this.isLargePlaylist) ||
            this.isFetching
        );
    }

    get isLargePlaylist(): boolean {
        return this.itemsInPlaylist > this.maxItemDownloadable;
    }

    /**
     * Weird error for some channels when the nextPageToken doesn't return results at all, thus concept of previousVideoListLength
     */
    get checkVideoList(): boolean {
        return (
            this.videoList.length < this.currentMaxItemLimit &&
            this.videoList.length != this.previousVideoListLength &&
            this.videoList.length < this.itemsInPlaylist
        );
    }
    async fetchVideosInPlaylist(firstRun: boolean) {
        this.isFetching = true;
        if (this.currentMaxItemLimit <= this.videoList.length)
            this.currentMaxItemLimit += 1000;
        try {
            const response = await this.youtubeService.getVideoList(
                this.playlistId,
                this.nextPageToken
            );
            this.itemsInPlaylist = response.itemCount;
            this.nextPageToken = response.nextPageToken;
            this.previousVideoListLength = this.videoList.length;
            if (this.videoList.length < this.itemsInPlaylist)
                this.videoList = _.concat(this.videoList, response.itemList);
            if (this.checkVideoList && this.dialog)
                this.fetchVideosInPlaylist(false);
            else this.isFetching = false;
        } catch (error) {
            this.isFetching = false;
            const status = error.response ? error.response.status : "404";
            this.alert = {
                type: "error",
                message: `${DOWNLOAD_ERROR_TYPES[status]}`,
            };
            throw new Error("fetchVideosInPLaylistError: " + error);
        }
    }

    @Watch("parentVideoList")
    onParentVideoListChanged() {
        this.copyParentData();
    }

    @Watch("dialog")
    async onDialogChanged(val: boolean, oldVal: boolean) {
        this.resetState();
        if (val && this.playlistId) this.fetchVideosInPlaylist(true);
    }

    copyParentData() {
        this.nextPageToken = this.isParentAhead
            ? this.parentNextPageToken
            : this.nextPageToken;
        this.videoList = this.isParentAhead
            ? _.cloneDeep(this.parentVideoList)
            : this.videoList;
    }

    formatLongTitle(title: string): string {
        return title.substr(0, 15).length == title.length
            ? title
            : title.substr(0, 15) + "...";
    }

    downloadItems(): void {
        const downloadRequest: DownloadRequest = {
            requestId: generateUniqueId(),
            audioOnly: this.audioOnly,
            playlistTitle: this.playlistTitle,
            channelTitle: this.channelTitle,
            itemSelected: this.videoList,
            downloadFolder: this.downloadFolderService.getDownloadFolder(),
        };

        window.myIpcRenderer.send("download-videos", downloadRequest);
        this.dialog = false;
    }

    resetState() {
        this.videoList = [];
        this.nextPageToken = "";
        if (this.parentVideoList.length != 0) this.copyParentData();
    }
}
</script>