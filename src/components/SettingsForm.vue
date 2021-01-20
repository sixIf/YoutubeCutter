<template>
    <div>
        <v-card class="elevation-12 card">
            <v-toolbar color="secondary" dark flat>
                <v-toolbar-title>{{$t("Settings.title")}}</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <!-- <alert :alert="alert"></alert> -->
                <v-form @submit.prevent="submitForm">
                    <!-- <v-text-field
                        v-model="folderPath"
                        :label="$t('Settings.folder')"
                        :placeholder="$t('Settings.folderTip')"
                        prepend-icon="folder"
                        required
                        @click="selectDirectory()"
                    ></v-text-field> -->
                    <v-radio-group v-model="localeSelected" :row="true">
                        <v-radio
                            v-for="locale in locales"
                            :key="locale"
                            :label="locale"
                            :value="locale"
                        ></v-radio>
                    </v-radio-group>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    type="submit"
                    @click.prevent="submitForm"
                    >{{$t("Settings.save")}}</v-btn
                >
            </v-card-actions>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { YOUTUBE_SERVICE } from "@/config/litterals";
import { IYoutubeService } from "@/services/youtubeService";
import Alert from "@/components/Alert.vue";
const { myIpcRenderer } = window;

@Component({
    components: {
        Alert,
    },
})
export default class SettingsForm extends Vue {
    @Inject(YOUTUBE_SERVICE)
    youtubeService!: IYoutubeService;
    // folderPath: string | null = this.downloadFolderService.getDownloadFolder();
    alert: { type: string; message: string } | null = null;
    localeSelected = "";

    get locales(): string[] {
        return this.$i18n.availableLocales;
    }

    selectDirectory() {
        window.myIpcRenderer.send("select-folder", {});
    }


    async submitForm() {
        // Set locale
        this.$i18n.locale = this.localeSelected;
        myIpcRenderer.send("set-current-locale", this.localeSelected)
    }

    mounted() {
        this.localeSelected = this.$i18n.locale;
        console.log(this.$i18n.locale)
        // window.myIpcRenderer.receive(
        //     "selected-folder",
        //     (data: string[] | undefined) => {
        //         this.alert = null;
        //         if (data) {
        //             this.folderPath = data[0];
        //             this.downloadFolderService.setDownloadFolder(
        //                 this.folderPath
        //             );
        //             // this.alert = {
        //             //     type: "success",
        //             //     message: "The folder has been set. You can start downloading !",
        //             // };
        //         }
        //     }
        // );
    }
}
</script>