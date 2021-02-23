<template>
    <v-container fluid class="second-bar grayThree" :style="`height: ${appBarHeight};`">
        <v-row align="center">
            <v-col cols="2">
                <router-link to="/">
                    <v-btn icon>
                        <svg style="width:50px;height:50px" viewBox="0 0 24 24">
                            <path :fill="$vuetify.theme.currentTheme.primary" d="M19.07,4.93C17.22,3 14.66,1.96 12,2C9.34,1.96 6.79,3 4.94,4.93C3,6.78 1.96,9.34 2,12C1.96,14.66 3,17.21 4.93,19.06C6.78,21 9.34,22.04 12,22C14.66,22.04 17.21,21 19.06,19.07C21,17.22 22.04,14.66 22,12C22.04,9.34 21,6.78 19.07,4.93M17,12V18H13.5V13H10.5V18H7V12H5L12,5L19.5,12H17Z" />
                        </svg>
                    </v-btn>                
                    <!-- <v-img @click="$router.push('/')" src="../assets/image/icon.png" height="40px" width="40px"></v-img> -->
                </router-link>
            </v-col>
            <v-col cols="2" offset="8">
                <v-row justify="end" align="center">
                    <v-col cols="3">
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
                    </v-col>
                    <v-col cols="3">
                        <router-link to="/help">
                            <v-btn icon color="grayOne">
                                <v-icon size="35" class="card--text">mdi-help-circle</v-icon>
                            </v-btn>
                        </router-link>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import 'flag-icon-css/css/flag-icon.css'
import _ from "lodash";
import { localesToFlag, localeType } from "@/i18n";
import { APP_BAR_HEIGHT } from '@/config/litterals/ui'
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
    
    get appBarHeight(): string {
        return APP_BAR_HEIGHT;
    }
}
</script>