module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
        "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
        "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "react/prop-types": 0,
        "react/destructuring-assignment": 0,
        "max-len": ["error", { "code": 120 }],
        "react/jsx-one-expression-per-line": 0,
        "import/prefer-default-export": 0,
        "react/jsx-props-no-spreading": 0,
        "react/display-name": 0,
        "react/state-in-constructor": 0,
        "react/static-property-placement": 0,
        "react/forbid-prop-types": 0,
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/ban-ts-ignore": 0,
        "@typescript-eslint/no-non-null-assertion": 0,

    },
    settings: {
        react: {
            version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
};
