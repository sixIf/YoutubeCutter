<template>
    <v-card>

    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SliceManager extends Vue {
    @Prop({ default: 0}) currentTime!: number;
    
}
</script>