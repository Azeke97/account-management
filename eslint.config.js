import vue from "eslint-plugin-vue"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import vueParser from "vue-eslint-parser"
import prettier from "eslint-config-prettier"

export default [
    {
        ignores: ["node_modules/", "dist/", "*.config.js", "*.config.cjs", "public/"],
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            "semi": ["error", "never"],
            "@typescript-eslint/semi": ["error", "never"],
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/explicit-module-boundary-types": "off",
        },
    },
    {
        files: ["**/*.vue"],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                parser: tsParser,
            },
        },
        plugins: {
            vue,
            "@typescript-eslint": tseslint,
        },
        rules: {
            ...vue.configs["vue3-recommended"].rules,
            ...tseslint.configs.recommended.rules,
            "semi": ["error", "never"],
            "@typescript-eslint/semi": ["error", "never"],
            "vue/multi-word-component-names": "off",
            "vue/no-v-html": "off",
            "vue/html-indent": ["error", 2],
            "vue/html-self-closing": [
                "error",
                {
                    html: { void: "always", normal: "never", component: "always" },
                },
            ],
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/explicit-module-boundary-types": "off",
        },
    },
    prettier,
]
