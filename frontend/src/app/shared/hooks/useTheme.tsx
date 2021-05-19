import { useEffect, useState } from "react";

const themeKeys = {
    "--primary-color": "",
    "--primary-color-light": "",
    "--primary-color-dark": "",
    "--accent-color": "",
    "--accent-color-light": "",
    "--accent-color-dark": "",
    "--background-color": "",
    "--surface-color": "",
    "--card-form-header-backgrund": "",
    "--card-form-header-text": "",
    "--error-color": "",
    "--primary-contrast": "",
    "--accent-contrast": "",
    "--background-contrast": "",
    "--text-on-card-background": "",
    "--secondary-text-on-card": "",
    "--input-border-normal": "",
    "--input-border-focus": "",
    "--input-text": "",
    "--input-background": "",
    "--control-focus-background": "",
    "--disabled-color": "",
    "--disabled-contrast": "",
};

export type Theme = typeof themeKeys;

export const useTheme = () => {
    const [value, setValue] = useState(themeKeys);

    useEffect(() => {
        const computedStyles: CSSStyleDeclaration = window.getComputedStyle(document.body);

        const updatedTheme = Object.keys(themeKeys).reduce((obj, key) => {
            return { ...obj, [key]: computedStyles.getPropertyValue(key) };
        }, {} as Theme);

        setValue(updatedTheme);
    }, []);

    return value;
};

export default useTheme;
