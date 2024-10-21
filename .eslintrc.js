module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["react", "react-hooks", "react-native", "prettier", "import"],
  settings: {
    "import/resolver": {
      "babel-module": {},
    },
  },
  rules: {
    "prettier/prettier": "error",
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
    "react-hooks/rules-of-hooks": ["error"],
    "react-hooks/exhaustive-deps": "warn",
  },
};
