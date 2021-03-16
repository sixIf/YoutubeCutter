import Vue from 'vue'
import VueI18n from 'vue-i18n'
import translationsEn from "./translations/en";
import translationsFr from "./translations/fr";

Vue.use(VueI18n);

// Ready translated locale messages
const messages = {
    en: translationsEn,
    fr: translationsFr
}

export type localeType = keyof typeof messages;

// Country code and flag based on https://flagicons.lipis.dev/
export const localesToFlag = {
	en: 'gb',
	fr: 'fr'
}

// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: 'en', // set default locale
    messages, // set locale messages
})


export default i18n;