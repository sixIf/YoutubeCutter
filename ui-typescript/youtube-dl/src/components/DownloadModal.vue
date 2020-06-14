<template>
  <div>
    <v-container class="list-item-container" fluid>
      <v-row dense>
        <p v-if="!itemList">No {{ itemType }} found</p>
        <v-col v-for="item in itemList" :key="item.id" cols="2">
          <v-card @click="clickAction(item.id)">
            <v-img
              :src="item.thumbnail"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="item.title"></v-card-title>
            </v-img>

            <v-card-actions>
              <v-spacer></v-spacer>
              <download-modal :itemId="item.id">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon>
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </template>
              </download-modal>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Provide, Prop, Vue } from "vue-property-decorator";
import { YOUTUBESERVICE, ERROR_TYPES } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";

@Component
export default class DownloadModal extends Vue {
  @Prop(String) videoId: string | null = null;

  dialog = false;
  audioOnly = false;
  quality: string | null = null;
  qualityTypes = ["high", "medium", "low"];
}
</script>