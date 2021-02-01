<template>
    <transition name="fade">
        <router-view/>
    </transition>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from "vue-property-decorator";

// Define the component in class-style
@Component
export default class Home extends Vue {}
</script>
<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease-in;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
