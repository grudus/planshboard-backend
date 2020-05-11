import { useEffect, useState } from "react";

const themeKeys = {
    "--primary-color": "",
    "--primary-color-light": "",
    "--primary-color-dark": "",
    "--accent-color": "",
    "--accent-color-light": "",
    "--accent-color-dark": "",
    "--main-background": "",
    "--card-background": "",
    "--table-background": "",
    "--card-form-header-backgrund": "",
    "--card-form-header-text": "",
    "--error-color": "",
    "--text-on-primary": "",
    "--text-on-accent": "",
    "--text-on-main-background": "",
    "--text-on-card-background": "",
    "--secondary-text-on-card": "",
    "--menu-icon-color": "",
    "--input-border-normal": "",
    "--input-border-focus": "",
    "--input-text": "",
    "--input-text-muted": "",
    "--input-background": "",
    "--input-placeholder": "",
    "--icon-button-hover-background": "",
    "--disabled-background": "",
    "--disabled-text-color": "",
    "--nav-solid-color": "",
    "--nav-light-color": "",
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
