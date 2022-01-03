module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: ["plugin:react/recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    rules: {
        "max-len": ["error", { code: 120 }],
        "jsx-a11y/anchor-is-valid": 0,
        "import/prefer-default-export": 0,
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/ban-ts-ignore": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "react/prop-types": 0,
        "react/destructuring-assignment": 0,
        "react/jsx-one-expression-per-line": 0,
        "react/jsx-props-no-spreading": 0,
        "react/display-name": 0,
        "react/state-in-constructor": 0,
        "react/static-property-placement": 0,
        "react/forbid-prop-types": 0,
    },
    settings: {
        react: {
            version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
};
