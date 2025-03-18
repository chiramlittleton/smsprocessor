module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["jest"], // ✅ Explicitly add Jest plugin
  parserOptions: {
    ecmaVersion: 12,
  },
  globals: {
    process: "readonly",
    __dirname: "readonly",
  },
  rules: {
    "prettier/prettier": "error",
    "no-console": "warn",
    eqeqeq: "error",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
