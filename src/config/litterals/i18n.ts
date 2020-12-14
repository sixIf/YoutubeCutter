export const localesInfos = {
    en: {
        name: "English",
        emoji: "🇺🇸",
        code: "en"
    },
    fr: {
        name: "Français",
        emoji: "🇫🇷",
        code: "fr"
    },
    pt: {
        name: "Português",
        emoji: "🇧🇷",
        code: "pt"
    }
}
  
export type locales = keyof typeof localesInfos;
export const availableLocales: Array<locales> = ["en", "fr", "pt"];