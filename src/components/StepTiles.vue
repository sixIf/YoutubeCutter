<template>
    <v-card class="card" height="200px">
        <v-container style="height: 100%">
            <v-row align="center" style="height: 100%" justify="center">
                <v-col cols="4">
                    <div class="step-number">{{ step }}</div>
                </v-col>
                <v-col cols="8" class="text-col" align-self="start">
                    <h2 class="step-title"><slot name="title"/></h2>
                    <p><slot name="content"/></p>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StepTiles extends Vue {
    @Prop({default: 1}) step!: number;
}
</script>
<style scoped>
    .step-number {
        font-size: 2.5em;
        font-weight: bold;
        height: 70px;
        width: 70px;
        border-radius: 50%;
        background-color: #d2e3fc;
        color: #4285f4;
        text-align: center;
        line-height: 70px;
    }

    .step-title {
        line-height: 25px;
        padding-bottom: 5px;
        font-size: 1.4em;
    }

    .text-col {
        padding-top: 35px;
    }
</style>