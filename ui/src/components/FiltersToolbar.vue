<template>
  <v-card>
    <v-container fluid>
      <v-row>
        <v-col cols="2">
          <v-text-field v-model="keyword" :label="searchLabel"></v-text-field>
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