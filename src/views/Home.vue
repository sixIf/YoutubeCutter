<template>
    <v-container fluid>
        <v-row no-gutters fill-height align="center" justify="center">
            <v-col cols="8">
                <search-youtube-text-field @videos-found="$router.push('manage-videos')"/>
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
export default class HomeSearchForm extends Vue {

}
</script>