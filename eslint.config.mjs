import react from "eslint-plugin-react";
import jsx from "eslint-plugin-jsx";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**/*",
      "**/build/**/*",
      "**/build/",
      "**/coverage",
      "**/webpack.*.js",
    ],
  },
  {
    plugins: {
      react,
      jsx,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: babelParser,
      ecmaVersion: 9,
      sourceType: "module",

      parserOptions: {
        requireConfigFile: false,

        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "react/prop-types": "off",
      "react/no-unescaped-entities": "warn",
      "react/display-name": "off",

      "no-unused-vars": [
        "warn",
        {
          vars: "local",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "no-undef": "warn",
    },
  },
  eslintConfigPrettier,
];
