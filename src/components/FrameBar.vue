/* eslint-disable @typescript-eslint/no-non-null-assertion */
<template>
    <v-app-bar class="frame-bar" color="secondary card--text" height="20px" app dense dark>
        <v-spacer></v-spacer>
        <div id="minimize" 
            class="window-minimize-button window-control" 
            @click="minimizeWindow()" 
            @mouseover="brightUp('minimize')" 
            @mouseleave="makeTransparent('minimize')"
        >
            <svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
                <rect fill="currentColor" width="10" height="1" x="1" y="6"></rect>
            </svg>        
        </div>
        <div id="maximize"
            class="window-maximize-button window-control" 
            @click="maximizeWindow()" 
            @mouseover="brightUp('maximize')" 
            @mouseleave="makeTransparent('maximize')"
        >
            <svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
                <rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="currentColor"></rect>
            </svg>
        </div>
        <div id="close" 
            class="window-close-button window-control" 
            @click="closeWindow()" 
            @mouseover="brightUp('close')" 
            @mouseleave="makeTransparent('close')"
        >
            <svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
                <polygon fill="currentColor" fill-rule="evenodd" points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"></polygon>
            </svg>
        </div>
        <!-- ADD minimize etc -->
    </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
const { myIpcRenderer } = window;

@Component
export default class FrameBar extends Vue {
    minimizeWindow () {
        myIpcRenderer.send('minimize-window', {});
    }

    maximizeWindow () {
        myIpcRenderer.send('maximize-window', {});
    }

    closeWindow () {
        myIpcRenderer.send('close-window', {});
    }

    brightUp(id: string) {
        const element = document.getElementById(id)!;
        console.log(element)
        switch (id) {
            case 'close':
                element.style.backgroundColor = 'crimson';
                break;
        
            default:
                console.log('ola')
                element.style.backgroundColor = '#8a5353';
                break;
        }
    }

    makeTransparent(id: string) {
        const element = document.getElementById(id)!;
        element.style.backgroundColor = 'transparent';
    }
}
</script>
<style>
    .frame-bar {
        z-index: 50;
        -webkit-app-region: drag
    }

    .v-toolbar__content {
        padding-right: 0px !important;
    }

    .window-control {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        top: 0;
        width: 25px;
        height: 20px;
        cursor: pointer;
        -webkit-app-region: no-drag;
    }
</style>