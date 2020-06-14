module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/style.scss";`,
      },
    },
  },
};
