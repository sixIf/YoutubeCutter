<template>
    <v-container>
        <v-row justify="center">
            <youtube-player :videoId="videoId"/>
        </v-row>
    </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import { MenuDependency, MenuItems } from '@/config/litterals';
import _ from 'lodash';
import { Component, Vue } from "vue-property-decorator";
import YoutubePlayer from "@/components/YoutubePlayer.vue"


// Define the component in class-style
@Component({
    components: {
        YoutubePlayer
    }
})
export default class VideoEditor extends Vue {
    get videoId() {
        return this.$route.params.id;
    }
}
</script>