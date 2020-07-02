<template>
  <div>
    <v-card class="elevation-12">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Youtube Api Key</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-alert
          v-if="alert"
          dismissible
          v-model="displayAlert"
          :type="alert.type"
        >{{ alert.message }}</v-alert>
        <v-form @submit.prevent="setApiKey">
          <v-text-field
            v-model="apiKey"
            label="Api Key"
            name="api-key"
            prepend-icon="vpn_key"
            type="text"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" :disabled="!apiKey" type="submit" @click.prevent="setApiKey">Save</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { APIKEYSERVICE, YOUTUBESERVICE } from "@/config/litterals";
import { IApiKeyService } from "@/services/apiKeyService";
import { IYoutubeService } from "@/services/youtubeService";

@Component
export default class ApiKeyForm extends Vue {
  @Inject(APIKEYSERVICE)
  apiKeyService!: IApiKeyService;
  @Inject(YOUTUBESERVICE)
  youtubeService!: IYoutubeService;

  alert: { type: string; message: string } | null = null;

  get displayAlert() {
    if (this.alert) return true;
    else return false;
  }

  apiKey: string | null = this.apiKeyService.getApiKey();

  async setApiKey() {
    // Test if Youtube Api key is valid
    try {
      const response = await this.youtubeService.testApiKey(this.apiKey);
      if (this.apiKeyService.setApiKey(this.apiKey)) {
        this.$router.push("/");
      } else {
        // Handle error ?
      }
    } catch (err) {
      this.alert = {
        type: "error",
        message: "Your Api Key is invalid."
      };
    }
  }
}
</script>