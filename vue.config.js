process.env.VUE_APP_VERSION = "http://localhost:8080"

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/style.scss";`,
      },
    },
  },
};
