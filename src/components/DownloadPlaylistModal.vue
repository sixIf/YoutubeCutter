<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ on }">
      <v-btn :disabled="disabled" v-on="on" color="primary">{{ getButtonTitle }}</v-btn>
    </template>
    <slot></slot>
    <v-card>
      <v-card-title class="headline">{{ getModalTitle }}</v-card-title>
      <v-card-text>
        <v-container>
          <v-progress-linear
            :active="isFetching"
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
          <v-col cols="12">
            <h2>{{videoList.length}}/{{itemsInPlaylist}} fetched</h2>
          </v-col>
          <v-row>
            <v-col cols="12">
              <v-switch v-model="audioOnly" label="Audio only"></v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn :disabled="isFetching" color="green darken-1" text @click="downloadItems">Download</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";
import {
  ItemStruct,
  YOUTUBESERVICE,
  ItemFetched,
  DownloadRequest,
} from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
import _ from "lodash";

@Component
export default class DownloadPlaylistModal extends Vue {
  @Inject(YOUTUBESERVICE)
  youtubeService!: IYoutubeService;

  @Prop({ default: false }) isMainPlaylist!: boolean;
  @Prop({ default: false }) disabled!: boolean;
  @Prop({ default: "" }) parentNextPageToken!: string;
  @Prop({ default: [] }) parentVideoList!: ItemStruct[];
  @Prop({ default: "" }) playlistId!: string;
  @Prop({ default: "" }) playlistTitle!: string;

  audioOnly = false;
  dialog = false;
  videoList: ItemStruct[] = [];
  itemsInPlaylist = 0;
  isFetching = false;
  nextPageToken = "";
  previousVideoListLength = 0;

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

  formatLongTitle(title: string): string {
    return title.substr(0, 15).length == title.length
      ? title
      : title.substr(0, 15) + "...";
  }

  downloadItems(): void {
    const downloadRequest: DownloadRequest = {
      audioOnly: this.audioOnly,
      playlistTitle: this.playlistTitle,
      channelTitle: this.channelTitle,
      itemSelected: this.videoList,
    };

    window.myIpcRenderer.send("download-videos", downloadRequest);
    this.dialog = false;
  }

  /**
   * Weird error for some channels when the nextPageToken doesn't return results at all, thus concept of previousVideoListLength
   */
  get checkVideoList(): boolean {
    return (
      this.videoList.length < 1000 &&
      this.videoList.length != this.previousVideoListLength &&
      this.videoList.length < this.itemsInPlaylist
    );
  }

  async fetchVideosInPlaylist() {
    this.isFetching = true;
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
      if (this.checkVideoList && this.dialog) this.fetchVideosInPlaylist();
      else this.isFetching = false;
    } catch (error) {
      throw new Error("fetchVideosInPLaylistError: " + error);
    }
  }

  @Watch("parentVideoList")
  onParentVideoListChanged() {
    this.nextPageToken = this.isParentAhead
      ? this.parentNextPageToken
      : this.nextPageToken;
    this.videoList = this.isParentAhead
      ? _.cloneDeep(this.parentVideoList)
      : this.videoList;
  }

  @Watch("dialog")
  async onDialogChanged(val: boolean, oldVal: boolean) {
    if (this.parentVideoList.length == 0) this.resetState();
    if (val && this.playlistId) {
      this.fetchVideosInPlaylist();
    }
  }

  resetState() {
    this.videoList = [];
    this.nextPageToken = "";
  }
}
</script>