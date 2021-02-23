<template>
        <v-container style="height: 100%">
            <v-row no-gutters style="height: 15%" align="center" justify="start">
                <v-col cols="2">
                    <v-img src="../assets/image/icon.png" height="50px" width="50px"></v-img>
                </v-col>
                <v-col cols="7">
                    <h2>{{ $t("slice.managerTitle") }}</h2>
                </v-col>
                <v-col cols="3">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            rounded
                            color="primary"
                            :disabled="!canCreateSlice"
                            @click="createSlice"
                            v-bind="attrs"
                                v-on="on"
                        >
                            {{ $t('slice.add') }}
                        </v-btn>
                        </template>
                        <span> {{ canCreateSlice ? $t("slice.addLabel") : $t("slice.cantAdd") }} </span>  
                    </v-tooltip>                    
                </v-col>
            </v-row>
            <v-row no-gutters justify="start" style="height: 400px">
                <v-col cols="12">
                    <v-list id="slice-list" class="grayThree" height="400px" style="overflow-y: scroll; overflow-x: hidden">
                        <v-list-item v-for="(slice, index) in selectedVideo.sliceList" :key="slice.id">
                            <v-container>
                                <v-row align="center" :class="index == 0 ? activeClass(slice) : ''">
                                    <v-col cols="2">
                                        <v-icon size="40px">{{`mdi-numeric-${index}-box`}}</v-icon>
                                    </v-col>
                                    <v-col cols="10">
                                        <v-row align="center" justify="start">
                                            <v-col cols="4">
                                                <v-text-field :value="slice.name" @input="debouncedSetName($event, slice, index)" :label="$t('slice.name')"></v-text-field>
                                            </v-col>
                                            <v-col cols="5">
                                                <v-select :value="slice.format"
                                                    @change="setFormat($event, slice, index)"
                                                    :items="availableFormats"
                                                    :label="$t('format.format')"
                                                    return-object
                                                    persistent-hint                          
                                                >
                                                    <template v-slot:selection="{item}">
                                                        {{ getSelectText(item) }}
                                                    </template>
                                                    <template v-slot:item="{item}">
                                                        {{ getSelectText(item) }}
                                                    </template>                            
                                                </v-select>
                                            </v-col>
                                            <v-col v-if="index == 0" cols="3">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-icon class="theme--light" 
                                                            @click="changeIsActive(slice, index)"
                                                            v-bind="attrs"
                                                            v-on="on"
                                                        >
                                                            {{ slice.isActive ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'}}
                                                        </v-icon>
                                                    </template>
                                                    <span>{{ $t("slice.keep") }}</span>
                                                </v-tooltip>
                                            </v-col>       
                                            <v-col v-else cols="3">
                                                <v-row no-gutters>
                                                    <v-col cols="6">
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn
                                                                    fab
                                                                    small
                                                                    @click="playSlice(slice)"
                                                                    v-bind="attrs"
                                                                    v-on="on"
                                                                >
                                                                    <v-icon class="theme--light">mdi-play</v-icon>
                                                                </v-btn>
                                                            </template>
                                                            <span> {{ $t("slice.preview") }} </span>
                                                        </v-tooltip>
                                                    </v-col>
                                                    <v-col cols="6" class="pl-1">
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn
                                                                    fab
                                                                    small
                                                                    @click="deleteSlice(index)"
                                                                    v-bind="attrs"
                                                                    v-on="on"
                                                                >
                                                                    <v-icon class="theme--light">mdi-delete</v-icon>
                                                                </v-btn>
                                                            </template>
                                                            <span> {{ $t("slice.delete") }} </span>
                                                        </v-tooltip>
                                                    </v-col>
                                                </v-row>
                                            </v-col>       
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row v-if="index != 0" justify="center"  style="padding-bottom: 5px;">
                                    <v-col cols="12" md="12" lg="11">
                                        <span class="time-recap">
                                            {{ $t("slice.cutFrom")}} 
                                            &nbsp;&nbsp;
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn
                                                        class="selectableTime grayThree--text mr-3 ml-3"
                                                        color="darkPrimary"
                                                        @click="setStartTime(slice, index)"
                                                        v-on="on"
                                                        v-bind="attrs"
                                                    >
                                                        {{ getFormattedTime(slice.startTime)}}
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("slice.copyTime") }}</span>
                                            </v-tooltip>
                                            {{ $t("slice.toTime") + "&nbsp;" }}
                                            <span>&nbsp;</span>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn
                                                        class="selectableTime grayThree--text mr-3 ml-3"
                                                        color="darkPrimary"
                                                        @click="setEndTime(slice, index)"
                                                        v-on="on"
                                                        v-bind="attrs" 
                                                    >
                                                        {{ getFormattedTime(slice.endTime)}}
                                                    </v-btn>                                        
                                                </template>
                                                <span>{{ $t("slice.copyTime") }}</span>
                                            </v-tooltip>
                                            <span>{{ getTimeRecap(slice) }}</span>
                                        </span>
                                    </v-col>
                                </v-row>
                                <v-divider></v-divider> 
                            </v-container>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
    </v-container>
</template>

<script lang="ts">
import { AvailableFormats, DOWNLOAD_FORMATS, PlayRequest, SlicedYoutube, SliceToUpdate, VideoDetail } from "@/config/litterals";
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
import _, { toInteger } from "lodash"
import { MAX_SLICE } from "@/config/litterals"
import { formatTime } from "@/utils/time";
import { getCurrentTime } from "@/helpers/videoHelper";

@Component
export default class SliceManager extends Vue {
    @Getter('fetchedVideosState/getSelectedVideo') selectedVideo!: VideoDetail;
    debouncedSetName = _.debounce((name, slice, index) => this.setName(name, slice, index), 3000);

    scrollBottomList(){
        const objDiv = document.getElementById("slice-list");
        if(objDiv) objDiv.scrollTop = objDiv.scrollHeight;
    }

    async createSlice(){
        const newSlice = Object.assign({}, this.selectedVideo.sliceList[0]);
        newSlice.name = newSlice.name.concat(` part-${this.selectedVideo.sliceList.length}`);
        newSlice.startTime = this.currentTime();
        await this.$store.dispatch('fetchedVideosState/createSlice', newSlice);
        this.scrollBottomList();
    }

    deleteSlice(index: number){
        this.$store.commit('fetchedVideosState/deleteSlice', index);
    }

    playSlice(slice: SlicedYoutube){
        const playRequest: PlayRequest = {
            start: slice.startTime,
            end: slice.endTime
        }; 
        this.$emit('play-slice', playRequest);
    }

    setStartTime(slice: SlicedYoutube, index: number){
        if (this.currentTime() < slice.endTime) {
            const updatedSlice = Object.assign({}, slice);
            updatedSlice.startTime = this.currentTime();
            this.updateSlice({index: index, updatedSlice: updatedSlice});
        }
    }

    setEndTime(slice: SlicedYoutube, index: number){
        if (this.currentTime() > slice.startTime) {
            const updatedSlice = Object.assign({}, slice);
            updatedSlice.endTime = this.currentTime();
            this.updateSlice({index: index, updatedSlice: updatedSlice});
        }
    }

    setName(name: string, slice: SlicedYoutube, index: number){
        const updatedSlice = Object.assign({}, slice);
        updatedSlice.name = name;
        this.updateSlice({index: index, updatedSlice: updatedSlice});
    }

    setFormat(format: AvailableFormats, slice: SlicedYoutube, index: number){
        const updatedSlice = Object.assign({}, slice);
        updatedSlice.format = Object.assign({}, format);
        this.updateSlice({index: index, updatedSlice: updatedSlice});
    }

    changeIsActive(slice: SlicedYoutube, index: number){
        const updatedSlice = Object.assign({}, slice);
        updatedSlice.isActive = !updatedSlice.isActive;
        this.updateSlice({index: index, updatedSlice: updatedSlice})
    }

    updateSlice(sliceToUpdate: SliceToUpdate){
        this.$store.commit('fetchedVideosState/setSlice', sliceToUpdate)
    }
    
    activeClass(slice: SlicedYoutube){
        return slice.isActive ? '' : 'disabledSlice';
    }

    getSelectText(format: AvailableFormats){
        return `${this.$t('format.'.concat(format.type))}  (${format.value})`
    }
    /**
     * Getters
     */

    get availableFormats(){
        return DOWNLOAD_FORMATS;
    }

    get canCreateSlice(): boolean {
        return this.selectedVideo.sliceList.length < MAX_SLICE;
    }

    currentTime(): number {
        return getCurrentTime();
    }

    getTimeRecap(slice: SlicedYoutube): string {
        const duration = formatTime(toInteger((slice.endTime - slice.startTime).toFixed(0)));
        return ` ${this.$t('slice.duration')} ${duration}.`;
    }

    /**
     * time is in seconds
     */
    getFormattedTime(time: number): string {
        return formatTime(toInteger(time.toFixed(0)));
    }
}
</script>
<style scoped>
    .disabledSlice {
        opacity: 0.5;
    }

    .selectableTime {
        cursor: pointer;
        border: solid;
        padding-left: 5px;
        padding-right: 5px;
    }

    .time-recap {
        font-weight: bold;
    }
</style>