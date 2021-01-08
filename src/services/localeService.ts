// import { i18nInstance } from '@/background';
import i18n from 'i18n'
import path from 'path'
import { LOCAL_STORAGE_LOCALE } from '@/config/litterals';
import { injectable } from "tsyringe";
import { availableLocales } from '@/config/litterals/i18n';


  
export interface ILocaleService {
  getCurrentLocale(): string;
  getLocales(): string[];
  setLocale(locale: string): void;
  translate(phrase: string, args?: any): string;
}

/**
 * LocaleService
 */
@injectable()
export class LocaleService implements ILocaleService {
    /**
     *
     * @param i18nProvider The i18n provider
     */
    private i18nProvider = i18n;


    constructor(){
        this.i18nProvider.configure({
            locales: availableLocales,
            directory: path.join(__dirname, '..', 'locales'),
            objectNotation : true,
            updateFiles: false,
            api: {
                '__': 'translate',  
                '__n': 'translateN' 
            },
        });
        
        const currentLocale = window.localStorage.getItem(LOCAL_STORAGE_LOCALE);
        if (currentLocale) this.setLocale(currentLocale);
    }

    /**
     *
     * @returns {string} The current locale code
     */
    getCurrentLocale(): string {
        return this.i18nProvider.getLocale();
    }
    /**
     *
     * @returns string[] The list of available locale codes
     */
    getLocales(): string[] {
        return this.i18nProvider.getLocales();
    }
    /**
     *
     * @param locale The locale to set. Must be from the list of available locales.
     */
    setLocale(locale: string): void {
        if (this.getLocales().indexOf(locale) !== -1) {
            this.i18nProvider.setLocale(locale);
            try {
                window.localStorage.setItem(LOCAL_STORAGE_LOCALE, locale);
            } catch (err) {
                window.log.error(err);
            }
        }
    }
    /**
     *
     * @param phrase String to translate
     * @param args Extra parameters
     * @returns {string} Translated string
     */
    translate(phrase: string, args = {}): string {
        return this.i18nProvider.__(phrase, args)
    }
  }