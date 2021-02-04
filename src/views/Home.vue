<template>
    <v-container fluid style="height: 100%;">
        <v-row align="center" justify="center" style="height: 100%;">
            <v-col cols="6">
                <v-card class="card" shaped height="300px">
                    <v-container style="height: 100%;">
                        <v-row align="center" justify="center" style="height: 100%;">
                            <v-col cols="8">
                                <search-youtube-text-field @videos-found="$router.push('manage-videos')"/>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>                
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SearchYoutubeTextField from "@/components/SearchYoutubeTextField.vue"

@Component({
    components: {
        SearchYoutubeTextField
    }
})
export default class Home extends Vue {}
</script>