<template>
    <v-main>
        <v-container class="home-container fill-height" fluid>
            <v-row align="center" justify="center" no-gutters>
                <v-col cols="12" md="8">
                    <v-card flat tile>
                        <v-window v-model="onboarding">
                            <v-window-item
                                v-for="(item, index) in items"
                                :key="`card-${index}`"
                            >
                                <v-card
                                    @click="handleCardClick(item.needApiKey, item.route)"
                                    class="clickable"
                                    :color="computeCardColor(item.needApiKey)"
                                    height="300"
                                >
                                    <v-row
                                        class="fill-height"
                                        align="center"
                                        justify="center"
                                        style="text-align: center;"
                                    >   
                                        <v-col cols="12">

                                            <h1
                                                style="font-size: 3rem"
                                                class="white--text"
                                            >
                                                {{ item.name }}
                                            </h1>
                                        </v-col>
                                        <v-col cols="12" v-if="item.needApiKey && !isApiKeySet">
                                            <br/>
                                            <p style="color: white">Set a Youtube API Key in settings to unlock this feature !</p>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-window-item>
                        </v-window>

                        <v-card-actions class="justify-space-between">
                            <v-btn text @click="prev">
                                <v-icon>mdi-chevron-left</v-icon>
                            </v-btn>
                            <v-item-group
                                v-model="onboarding"
                                class="text-center"
                                mandatory
                            >
                                <v-item
                                    v-for="item in items.length"
                                    :key="`btn-${item}`"
                                    v-slot:default="{ active, toggle }"
                                >
                                    <v-btn
                                        :input-value="active"
                                        icon
                                        @click="toggle"
                                    >
                                        <v-icon>mdi-record</v-icon>
                                    </v-btn>
                                </v-item>
                            </v-item-group>
                            <v-btn text @click="next">
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script lang="ts">
// @ is an alias to /src
import { API_KEY_SERVICE } from '@/config/litterals';
import { IApiKeyService } from '@/services/apiKeyService';
import _ from 'lodash';
import { Component, Inject, Vue } from "vue-property-decorator";

// Define the component in class-style
@Component
export default class Home extends Vue {
    @Inject(API_KEY_SERVICE)
    apiKeyService!: IApiKeyService;    
    onboarding = 0;
    items = [
        {
            needApiKey: true,
            name: "Explore Channel",
            route: "search-channel",
        },
        {
            needApiKey: false,
            name: "Search Videos",
            route: "search-videos",
        }
    ];

    isApiKeySet = this.apiKeyService.getApiKey();

    computeCardColor(needApiKey: boolean): string {
        if(needApiKey && !this.isApiKeySet)
            return "#483D3F"
        else
            return "#d32f2f"
    }

    handleCardClick(needApiKey: boolean, route: string) {
        if(!needApiKey || this.isApiKeySet)
            this.$router.push(route)
    }

    next() {
        this.onboarding =
            this.onboarding + 1 === this.items.length ? 0 : this.onboarding + 1;
    }
    prev() {
        this.onboarding =
            this.onboarding - 1 < 0
                ? this.items.length - 1
                : this.onboarding - 1;
    }

    created(){
        if(!this.isApiKeySet)
            _.reverse(this.items)
    }
}
</script>
<style>
.clickable {
    cursor: pointer;
}
</style>
