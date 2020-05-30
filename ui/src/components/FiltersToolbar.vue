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

<script>
export default {
  name: "filters-toolbar",

  props: {
    searchLabel: undefined
  },
  data() {
    return {
      keyword: undefined
    };
  }
};
</script>