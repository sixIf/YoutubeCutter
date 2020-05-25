<template>
  <v-alert dismissible v-model="displayAlert" :type="alert.type">{{ alert.message }}</v-alert>
</template>

<script>
export default {
  name: "alert",

  props: {
    displayAlert: false,
    alert: {
      type: undefined,
      message: undefined
    }
  }
};
</script>