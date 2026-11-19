import nextConfig from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [".next-dev/**"],
  },
  ...nextConfig,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
