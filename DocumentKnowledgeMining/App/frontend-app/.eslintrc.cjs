module.exports = {
    extends: [
        // By extending from a plugin config, we can get recommended rules without having to add them manually.
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:@typescript-eslint/recommended",
        // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
        // Make sure it's always the last config, so it gets the chance to override other configs.
        "eslint-config-prettier",
    ],
    settings: {
        react: {
            // Tells eslint-plugin-react to automatically detect the version of React to use.
            version: "detect",
        },
        // Tells eslint how to resolve imports
        "import/resolver": {
            node: {
                paths: ["src"],
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
            typescript: {
                alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
            },
        },
    },
    rules: {
        // Add your own rules here to override ones from the extended configs.

        // Note you must disable the base rule as it can report incorrect errors
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn", // or "error"
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            },
        ],
        // Avoid problem with Named type exports not being found https://github.com/typescript-eslint/typescript-eslint/issues/154
        "import/named": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "react/react-in-jsx-scope": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-static-element-interactions": "off",
    },
};
