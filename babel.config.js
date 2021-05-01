module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "formatjs",
        {
          idInterpolationPattern: "[sha512:contenthash:base64:6]",
          ast: true,
        },
      ],
      [
        "react-intl-auto",
        {
          filebase: false,
          removePrefix: "app/",
        },
      ],
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            test: "./test",
            underscore: "lodash",
            assets: "./src/assets",
            screens: "./src/screens",
            constants: "./src/constants",
            components: "./src/views/components",
            containers: "./src/views/containers",
            utils: "./src/utils",
            state: "./src/state",
            translations: "./src/translations",
          },
        },
      ],
    ],
  };
};
