<template>
  <v-alert dismissible v-model="displayAlert" :type="alert.type">{{ alert.message }}</v-alert>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IAlert } from "@/config/litterals/index";

@Component
export default class Alert extends Vue {
  @Prop() alert!: IAlert;

  get displayAlert() {
    if (this.alert) return true;
    else return false;
  }
}
</script>