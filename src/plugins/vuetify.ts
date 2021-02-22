import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: "#D32222",
        darkPrimary: "#A61313",
        darkestPrimary: "#830707",
        dullPrimary: "#CE6262",
        lightPrimary: "#F6D4D4",
        black: "#2B0202",
        grayOne: "#C9BEBE",
        grayTwo: "#EEE9E9",
        grayThree: "#F8F5F5",
        white: "#FFFFFF",
        error: "#824545",
        anchor: "transparent"
      },
    },
  },
});
