<template>
  <v-card>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="8">
          <v-text-field
            v-on:keyup.enter="$emit('search-keyword', keyword)"
            v-model="keyword"
            :label="searchLabel"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class FiltersToolbar extends Vue {
  @Prop(String) searchLabel: string | null = null;
  keyword: string | null = null;
}
</script>