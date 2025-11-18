import nextPlugin from "@next/eslint-plugin-next"

export default [
  {
    ignores: ["node_modules", ".next", "dist"],
  },
  nextPlugin.configs["core-web-vitals"],
]
