
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [".next/**", "next-env.d.ts"],
  },

  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: [
      "src/components/tambo/**/*.{ts,tsx}",
      "src/app/interactables/**/*.{ts,tsx}",
    ],
    rules: {
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
