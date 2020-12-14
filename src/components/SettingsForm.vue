<template>
    <div>
        <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
                <v-toolbar-title>{{__("Settings.title")}}</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <alert :alert="alert"></alert>
                <v-form @submit.prevent="submitForm">
                    <v-text-field
                        v-model="folderPath"
                        :label="$__('Settings.folder')"
                        :placeholder="$__('Settings.folderTip')"
                        prepend-icon="folder"
                        required
                        @click="selectDirectory()"
                    ></v-text-field>
                    <v-text-field
                        v-model="apiKey"
                        :label="$__('Settings.apiKey')"
                        name="api-key"
                        prepend-icon="vpn_key"
                        type="text"
                        clearable
                        @click:clear="apiKeyService.submitForm('')"
                    ></v-text-field>
                    <v-radio-group v-model="localeSelected" :row="true">
                        <v-radio
                            v-for="locale in localesInfos"
                            :key="locale.code"
                            :label="locale.name"
                            :value="locale.code"
                        ></v-radio>
                    </v-radio-group>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    :disabled="!apiKey"
                    type="submit"
                    @click.prevent="submitForm"
                    >{{$__("Settings.save")}}</v-btn
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
import Alert from "@/components/Alert.vue";
import { localesInfos } from "@/config/litterals/i18n"

@Component({
    components: {
        Alert,
    },
})
export default class SettingsForm extends Vue {
    @Inject(API_KEY_SERVICE)
    apiKeyService!: IApiKeyService;
    @Inject(DOWNLOAD_FOLDER_SERVICE)
    downloadFolderService!: IDownloadFolderService;
    @Inject(YOUTUBE_SERVICE)
    youtubeService!: IYoutubeService;
    folderPath: string | null = this.downloadFolderService.getDownloadFolder();
    apiKey: string | null = this.apiKeyService.getApiKey();
    alert: { type: string; message: string } | null = null;
    localeSelected: string = window.i18n.getCurrentLocale();

    get localesInfos(): typeof localesInfos {
        return localesInfos;
    }

    __(phrase: string, args: any) {
        return window.i18n.translate(phrase, args)
    }

    selectDirectory() {
        window.myIpcRenderer.send("select-folder", {});
    }


    async submitForm() {
        // Set locale
        window.i18n.setLocale(this.localeSelected);

        // Test if Youtube Api key is valid
        try {
            const response = await this.youtubeService.testApiKey(this.apiKey);
            if (this.apiKeyService.setApiKey(this.apiKey)) {
                this.alert = {
                    type: "success",
                    message: this.$__("Settings.formSuccess"),
                };
            } else {
                this.alert = {
                    type: "error",
                    message: this.$__("Settings.formError"),
                };
            }
        } catch (err) {
            this.alert = {
                type: "error",
                message: this.$__("Settings.formError"),
            };
        }
    }

    mounted() {
        console.log(window.i18n.translate('Home.savedTips'));
        window.myIpcRenderer.receive(
            "selected-folder",
            (data: string[] | undefined) => {
                this.alert = null;
                if (data) {
                    this.folderPath = data[0];
                    this.downloadFolderService.setDownloadFolder(
                        this.folderPath
                    );
                    // this.alert = {
                    //     type: "success",
                    //     message: "The folder has been set. You can start downloading !",
                    // };
                }
            }
        );
    }
}
</script>