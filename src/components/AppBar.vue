<template>
    <v-container fluid 
        class="second-bar grayThree" 
        :style="`flex: 0 0 ${appBarHeight}; height: ${appBarHeight}`"
    >
        <alert v-if="alert" 
            :alert="alert"
        >
        </alert>
        <v-row align="center">
            <v-col cols="2">
                <!-- <router-link to="/"> -->
                    <v-btn icon @click="goHome()">
                        <v-icon color="primary" size="50">
                            {{ homeIcon }}
                        </v-icon>
                    </v-btn>                 
                    <!-- <v-img @click="$router.push('/')" src="../assets/image/icon.png" height="40px" width="40px"></v-img> -->
                <!-- </router-link> -->
            </v-col>
            <v-col cols="2" offset="8">
                <v-row justify="end" align="center">
                    <v-col cols="4" lg="3">
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
                    <v-col cols="4" lg="3">
                        <router-link to="/help">
                            <v-btn icon color="grayOne">
                                <v-icon size="35">mdi-help-circle</v-icon>
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
import Alert from "@/components/Alert.vue"
import { localesToFlag, localeType } from "@/i18n";
import { APP_BAR_HEIGHT } from '@/config/litterals/ui'
import { IAlert } from "@/config/litterals";
import { Getter } from "vuex-class";

const { myIpcRenderer, log } = window;

@Component({
    components: {
        Alert
    }
})
export default class AppBar extends Vue {
    @Getter("uiState/getAlert")  alert: IAlert | undefined;
    currentLocale: localeType = "en";

    changeLocale(flag: string) {
        const locale  = _.findKey(localesToFlag, (value) => value == flag) as localeType;
        this.$i18n.locale = locale;
        this.currentLocale = locale;
        myIpcRenderer.send("set-current-locale", locale)
    }

    goHome(){
        if (this.$route.name == 'manage-videos') {
            this.$store.dispatch('fetchedVideosState/resetVideosState');
        }
        this.$router.push('/');
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

    get homeIcon(): string {
        return this.$route.name == "help" ? "mdi-arrow-left-circle" : "mdi-home-circle";
    }
}
</script>