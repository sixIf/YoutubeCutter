<template>
    <v-app-bar class="frame-bar" color="secondary card--text" height="20px" app dense dark>
        <!-- ADD minimize etc -->
    </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class FrameBar extends Vue {

}
</script>
<style>
    .frame-bar {
        z-index: 50;
        -webkit-app-region: drag
    }
</style>