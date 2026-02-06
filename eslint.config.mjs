import coreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...coreWebVitals,
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

export default config;
