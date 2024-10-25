/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
    // Test all files either suffixed with "-test.js", "-test.jsx", "-test.ts", "-test.tsx", or
    // having ".test.js", ".test.jsx", ".test.ts", ".test.tsx" extensions
    testRegex: ".*[-.]test\\.(js|ts)x?$",

    // Generate coverage reports in textm HTML, lcov and clover format
    coverageReporters: ["text", "html", "lcov", "clover"],

    // Use the default
    reporters: ["default"],

    // Postprocess test result to create a Bamboo format compatible report
    // testResultsProcessor: "jest-bamboo-reporter",

    moduleNameMapper: {
        // Alias @/ imports
        "@/(.*)": "<rootDir>/src/$1",
        // Alias #/ imports
        "#/(.*)": "<rootDir>/test/$1",
        // SCSS files
        "\\.scss$": "identity-obj-proxy",
    },

    // Project's path which coverage will be reported
    collectCoverageFrom: ["src/**/*.ts", "src/**/*.tsx"],
    coveragePathIgnorePatterns: [],
    modulePathIgnorePatterns: [],
    testPathIgnorePatterns: [],
};
