<template>
  <v-main>
    <v-container>
      <v-row align="center" justify="center">
        <v-col>
          <div class="faq text-center pt-8">
            <h1 style="color: accent">Get all the help you need</h1>
          </div>
        </v-col>
      </v-row>
      <v-spacer />
      <v-row align="center" justify="center">
        <v-col cols="8">
          <v-expansion-panels>
            <v-expansion-panel v-for="(item,i) in helpItems" :key="i">
              <v-expansion-panel-header>{{item.title}}</v-expansion-panel-header>
              <v-expansion-panel-content>{{item.message}}</v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { IHelpItems, HelpItems } from "@/config/litterals/help";

@Component
export default class Help extends Vue {
  helpItems: Array<IHelpItems> = HelpItems;
}
</script>