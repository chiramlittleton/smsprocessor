import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node, // Use Node.js globals instead of browser
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
      "eqeqeq": "error",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
  },
  pluginJs.configs.recommended,
  prettier, // Disable conflicting ESLint rules
  pluginPrettier, // Enable Prettier plugin
];
