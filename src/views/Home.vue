<template>
        <v-container class="fill-height" fluid>
            <v-row no-gutters justify="center">
                <v-col cols="6" lg="5">
                    <v-card 
                        flat
                        shaped
                        class="card"
                        elevation="10"
                        height="180"
                        min-height="150"
                        min-width="200"
                    >
                        <v-container class="fill-height">
                            <v-form @submit.prevent="searchItem">
                                <v-row no-gutters justify="center" class="pl-4 pr-4">
                                    <v-col cols="12" align-self="center">
                                        <v-radio-group v-model="radioGroup" row>
                                            <v-radio
                                                v-for="item in itemTypes"
                                                :key="item"
                                                :label="`${item}`"
                                                :value="item"
                                            ></v-radio>
                                        </v-radio-group>
                                        
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field 
                                            class="pl-4 pr-4"
                                            v-model="ytLink"
                                            :label="textLabel"
                                            :hint="hint"
                                            required
                                            append-outer-icon="mdi-send"
                                            @click:append-outer="searchItem" 
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import { YOUTUBE_SERVICE } from '@/config/litterals';
import { IYoutubeService } from '@/services/youtubeService';
import { Component, Inject, Vue } from "vue-property-decorator";
const { log } = window;

// Define the component in class-style
@Component
export default class Home extends Vue {
    @Inject(YOUTUBE_SERVICE)
    youtubeService!: IYoutubeService;
    ytLink = "";
    itemTypes = ["Video", "Playlist", "Channel"]
    radioGroup = "Video";
    
    get textLabel(){
        return `${this.radioGroup}`
    }

    get hint(){
        switch(this.radioGroup) {
            case "Playlist":
                return 'https://www.youtube.com/playlist?list=PLRBp0Fe2GpgmbpTy0fNGpoEtEzcDJ1IgQ';
            case "Channel":
                return 'https://www.youtube.com/user/NoCopyrightSounds';
            default:
                return "https://www.youtube.com/watch?v=jNQXAC9IVRw";
        }
    }

    async searchItem(){
        try {
            const videoId = await this.youtubeService.getVideoIdFromUrl(this.ytLink);
            this.$router.push({name: 'edit-video', params: { id: videoId }})
        } catch (err) {
            log.error(err);
        }
    }
}
</script>
<style>
.clickable {
    cursor: pointer;
}
</style>
