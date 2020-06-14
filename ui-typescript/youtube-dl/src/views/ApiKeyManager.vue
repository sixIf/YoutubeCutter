<template>
  <v-content>
    <v-container class="home-container fill-height" fluid>
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="12" sm="8" md="4">
          <api-key-form></api-key-form>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>


<script lang="ts">
import { Component, Inject, Provide, Vue } from "vue-property-decorator";
import ApiKeyForm from "@/components/ApiKeyForm.vue";

@Component({
  components: { ApiKeyForm }
})
export default class ApiKeyManager extends Vue {}
</script>