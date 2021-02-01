<template>
    <v-app class="primary">
            <v-snackbar v-model="snackbar" top color="info">
                {{ snackbarMessage }}
                <template v-slot:action="{ attrs }">
                    <v-btn dark text v-bind="attrs" @click="snackbar = false"
                        >Close</v-btn
                    >
                </template>
            </v-snackbar>
            <v-app-bar color="secondary card--text" style="z-index: 50" app dense dark>
                <router-link to="/">
                    <v-btn icon>
                        <v-icon class="card--text">mdi-home</v-icon>
                    </v-btn>
                </router-link>
                <v-toolbar-title @click="$router.push('/')" style="cursor: pointer">Youtube Downloader</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon v-if="isDownloading">
                    <v-icon>mdi-download-circle</v-icon>
                </v-btn>
                <router-link to="/help">
                    <v-btn icon>
                        <v-icon class="card--text">mdi-help-circle</v-icon>
                    </v-btn>
                </router-link>
                <v-speed-dial v-if="currentLocale != ''" direction="bottom">
                    <template v-slot:activator>
                        <v-btn
                            height="25"
                            min-width="40"
                            :class="`flag-icon-background flag-icon-${currentFlag}`"
                        ></v-btn>
                    </template>
                    <div v-for="flag in flagList" :key="flag">
                        <v-btn
                            height="20"
                            min-width="35"
                            small
                            @click="changeLocale(flag)"
                            :class="`flag-icon-background flag-icon-${flag}`"
                        ></v-btn>
                    </div>
                </v-speed-dial>
            </v-app-bar>
            <download-queue-drawer />
        <v-main class="primary">
            <router-view />
        </v-main>
    </v-app>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DownloadQueueDrawer from "@/components/DownloadQueueDrawer.vue";
import { DownloadRequest } from "./config/litterals";
import 'flag-icon-css/css/flag-icon.css'
import _ from "lodash";
import { localesToFlag, localeType } from "./i18n";
const { myIpcRenderer, log } = window;

// Define the component in class-style
@Component({
    components: {
        DownloadQueueDrawer,
    },
})
export default class App extends Vue {
    isDownloading = false;
    snackbar = false;
    snackbarMessage = "";
    currentLocale: localeType = "en";

    changeLocale(flag: string) {
        const locale  = _.findKey(localesToFlag, (value) => value == flag) as localeType;
        this.$i18n.locale = locale;
        this.currentLocale = locale;
        myIpcRenderer.send("set-current-locale", locale)
    }

    async mounted() {
        myIpcRenderer.receive(
            "download-error",
            (data: DownloadRequest) => {
                this.snackbar = true;
                this.snackbarMessage = `Download error : ${data.itemSelected[0].title}`;
            }
        );

        myIpcRenderer.send("set-locale-messages", this.$i18n.messages);

        await myIpcRenderer.invoke("get-current-locale", {})
            .then((locale) => {
                this.$i18n.locale = locale;
                this.currentLocale = this.$i18n.locale as localeType;
            })
            .catch((err) => {
                log.error(err);
            })
    }

    get currentFlag(): string {
        return localesToFlag[this.currentLocale];
    }

    get flagList(): string[] {
        const flags = _.filter(this.$i18n.availableLocales, (locale) => locale != this.currentLocale);
        return _.map(flags, (flag) => localesToFlag[flag as localeType])
    }
    
}
</script>
<style>
html {
    overflow: hidden;
}
/* width */
::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px white;
    border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #612222;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #612220;
}

.flag-icon-background{
    background-size: cover;
}
</style>