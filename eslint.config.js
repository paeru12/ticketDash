import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  { ignores: ["dist"] },

  // Next.js recommended rules
  {
    ...next.configs["core-web-vitals"],
  },

  {
    ...js.configs.recommended,

    files: ["**/*.{js,jsx}"],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      next,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
