<template>
        <v-container class="fill-height" fluid>
            <v-row no-gutters justify="center">
                <v-col cols="6" lg="5">
                    <v-card 
                        flat
                        shaped
                        class="card"
                        elevation="10"
                        height="150"
                        min-height="150"
                        min-width="200"
                    >
                        <v-container class="fill-height">
                            <v-row no-gutters justify="center">
                                <v-text-field 
                                    class="pl-4 pr-4"
                                    v-model="ytLink"
                                    label="Search for video, playlist or channel"
                                    hint="https://www.youtube.com/watch?v=jNQXAC9IVRw"
                                    required
                                    append-outer-icon="mdi-send"
                                    @click:append-outer="searchItem" 
                                ></v-text-field>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import { MenuDependency, MenuItems } from '@/config/litterals';
import _ from 'lodash';
import { Component, Vue } from "vue-property-decorator";

// Define the component in class-style
@Component
export default class Home extends Vue {
    ytLink = "";

    searchItem(){
        console.log(this.ytLink)
    }
}
</script>
<style>
.clickable {
    cursor: pointer;
}
</style>
