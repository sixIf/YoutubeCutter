<template>
    <v-main>
        <v-container class="home-container fill-height" fluid>
            <v-row align="center" justify="center" no-gutters>
                <v-col cols="12" sm="8" md="4">
                    <settings-form></settings-form>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>


<script lang="ts">
import { Component, Inject, Provide, Vue } from "vue-property-decorator";
import SettingsForm from "@/components/SettingsForm.vue";

@Component({
    components: { SettingsForm },
})
export default class Settings extends Vue {}
</script>