<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <SearchChannel />
  </div>
</template>

<script>
// @ is an alias to /src
import SearchChannel from "@/components/SearchChannel.vue";

export default {
  name: "Home",
  components: {
    SearchChannel
  }
};
</script>
