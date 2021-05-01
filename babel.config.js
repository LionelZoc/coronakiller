module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
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
          },
        },
      ],
    ],
  };
};
