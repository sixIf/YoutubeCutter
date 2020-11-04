<template>
  <v-alert v-if="alert" dismissible v-model="alertModel" :type="alert.type">{{ alert.message }}</v-alert>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IAlert } from "@/config/litterals/index";

@Component
export default class Alert extends Vue {
  @Prop() alert!: IAlert;
  alertModel = false;

  get displayAlert() {
    if (this.alert) return true;
    else return false;
  }

  @Watch("alert", { deep: true })
  onAlertChange(val: IAlert){
    if(val) this.alertModel = true;
  }

}
</script>