"use strict";
const extractReactIntlMessages = require("extract-react-intl-messages");

const locales = ["en", "fr"];
const pattern = "src/views/**/!(*.test).js";
const buildDir = "./src/translations";
const defaultLocale = "fr";

extractReactIntlMessages(locales, pattern, buildDir, { defaultLocale })
  .then(() => {
    console.log("finish");
  })
  .catch((error) => console.log(error));
