<template>
    <v-app-bar color="secondary card--text" style="z-index: 50" app dense dark>
        <router-link to="/">
            <v-btn icon>
                <v-icon class="card--text">mdi-home</v-icon>
            </v-btn>
        </router-link>
        <v-toolbar-title @click="$router.push('/')" style="cursor: pointer">Youtube Downloader</v-toolbar-title>
        <v-spacer></v-spacer>
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import 'flag-icon-css/css/flag-icon.css'
import _ from "lodash";
import { localesToFlag, localeType } from "@/i18n";
const { myIpcRenderer, log } = window;

@Component
export default class AppBar extends Vue {
    currentLocale: localeType = "en";

    changeLocale(flag: string) {
        const locale  = _.findKey(localesToFlag, (value) => value == flag) as localeType;
        this.$i18n.locale = locale;
        this.currentLocale = locale;
        myIpcRenderer.send("set-current-locale", locale)
    }

    async mounted() {
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

    /** 
     * Getters 
    */
    get currentFlag(): string {
        return localesToFlag[this.currentLocale];
    }

    get flagList(): string[] {
        const flags = _.filter(this.$i18n.availableLocales, (locale) => locale != this.currentLocale);
        return _.map(flags, (flag) => localesToFlag[flag as localeType])
    }    
}
</script>