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
        <app-bar />
        <download-queue-drawer />
        <v-main class="primary">
            <transition name="fade" mode="out-in">
                <router-view />
            </transition>
        </v-main>
    </v-app>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DownloadQueueDrawer from "@/components/DownloadQueueDrawer.vue";
import AppBar from "@/components/AppBar.vue";
import { DownloadRequest } from "@/config/litterals";
const { myIpcRenderer } = window;

// Define the component in class-style
@Component({
    components: {
        DownloadQueueDrawer,
        AppBar
    },
})
export default class App extends Vue {
    snackbar = false;
    snackbarMessage = "";

    mounted() {
        myIpcRenderer.receive(
            "download-error",
            (data: DownloadRequest) => {
                this.snackbar = true;
                this.snackbarMessage = `Download error : ${data.itemSelected[0].title}`;
            }
        );
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease-in;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>