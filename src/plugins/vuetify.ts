import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: "#822D2D", // #d32f2f
        lightPrimary: "#E89493", // #d32f2f
        secondary: "#612222", // #e57373
        card: "#DBDBDB",
        lightCard: "#EDEDED",
        darker: "#612222", // #3F51B5
        success: "#AE884E",
        cancel: "#673D3D",
        anchor: "transparent"

      },
    },
  },
});
