<template>
    <v-alert
		id="alert"
        v-if="alert.type"
        dismissible
        v-model="alertModel"
        :type="alert.type"
        class="white--text"
		:style="alertPosition"
		:width="alertWidth"
		transition="scale-transition"
        >{{ alert.message }}</v-alert
    >
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IAlert } from "@/config/litterals/index";
import { APP_BAR_HEIGHT } from "@/config/litterals/ui";

@Component
export default class Alert extends Vue {
    @Prop() alert!: IAlert;
    alertModel = false;
	currentAlertTimeout!: NodeJS.Timeout;
	alertDutation = 5000;

	@Watch("alert", { deep: true })
    onAlertChange(val: IAlert) {
        if (val) {
			this.clearCurrentTimeout();
			this.alertModel = true;
			this.currentAlertTimeout = setTimeout(() => {
				this.alertModel = false;
			}, this.alertDutation);
		}
    }

    clearCurrentTimeout(){
        if (this.currentAlertTimeout) clearTimeout(this.currentAlertTimeout);
    }
	get alertWidth() {
		return 500;
	}

	get alertPosition(): string {
        return `position: fixed; top: ${this.appBarHeight + 2}px; left: 50%; margin-left: -${this.alertWidth/2}px;`
    }
	

    get appBarHeight(): string {
        return APP_BAR_HEIGHT;
    }	
}
</script>
<style>
	.v-alert__content {
		color: var(--v-white-base) !important;
	}
</style>