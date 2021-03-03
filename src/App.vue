<template>
    <v-app class="grayThree">
        <frame-bar />
        <download-queue-drawer />
        <v-main class="grayThree">
            <app-bar />
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
import FrameBar from "@/components/FrameBar.vue";

// Define the component in class-style
@Component({
    components: {
        DownloadQueueDrawer,
        AppBar,
        FrameBar
    },
})
export default class App extends Vue {
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

* {
    font-family: Ubuntu !important;
    color: var(--v-black-base);
}

button {
    font-weight: 800 !important;
}

.v-tooltip__content span{
    color: var(--v-grayThree-base);
}
</style>