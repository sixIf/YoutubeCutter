<template>
    <div>
        <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Youtube Api Key</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <v-alert
                    v-if="alert"
                    dismissible
                    v-model="displayAlert"
                    :type="alert.type"
                    >{{ alert.message }}</v-alert
                >
                <v-form @submit.prevent="setApiKey">
                    <v-text-field
                        v-model="apiKey"
                        label="Api Key"
                        name="api-key"
                        prepend-icon="vpn_key"
                        type="text"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="folderPath"
                        label="Download Folder"
                        prepend-icon="folder"
                        @click="selectDirectory()"
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    :disabled="!apiKey"
                    type="submit"
                    @click.prevent="setApiKey"
                    >Save</v-btn
                >
            </v-card-actions>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import {
    API_KEY_SERVICE,
    DOWNLOAD_FOLDER_SERVICE,
    YOUTUBE_SERVICE,
} from "@/config/litterals";
import { IApiKeyService } from "@/services/apiKeyService";
import { IYoutubeService } from "@/services/youtubeService";
import { IDownloadFolderService } from "@/services/downloadFolderService";

@Component
export default class ApiKeyForm extends Vue {
    @Inject(API_KEY_SERVICE)
    apiKeyService!: IApiKeyService;
    @Inject(DOWNLOAD_FOLDER_SERVICE)
    downloadFolderService!: IDownloadFolderService;
    @Inject(YOUTUBE_SERVICE)
    youtubeService!: IYoutubeService;
    folderPath: string | null = this.downloadFolderService.getDownloadFolder();

    alert: { type: string; message: string } | null = null;

    get displayAlert() {
        if (this.alert) return true;
        else return false;
    }

    selectDirectory() {
        window.myIpcRenderer.send("select-folder", {});
    }

    apiKey: string | null = this.apiKeyService.getApiKey();

    async setApiKey() {
        // Test if Youtube Api key is valid
        try {
            const response = await this.youtubeService.testApiKey(this.apiKey);
            if (this.apiKeyService.setApiKey(this.apiKey)) {
                this.$router.push("/");
            } else {
                // Handle error ?
            }
        } catch (err) {
            this.alert = {
                type: "error",
                message: "Your Api Key is invalid.",
            };
        }
    }

    mounted() {
        window.myIpcRenderer.receive(
            "selected-folder",
            (data: string[] | undefined) => {
                if (data) {
                    this.folderPath = data[0];
                    this.downloadFolderService.setDownloadFolder(
                        this.folderPath
                    );
                }
            }
        );
    }
}
</script>