import React from "react";
import useTranslations from "app/locale/__hooks/useTranslations";
import css from "./text.module.scss";
import { cssIf, merge } from "utils/cssUtils";

type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps {
    text: string;
    variant?: Variant;
    className?: string;
    noTranslation?: boolean;
    center?: boolean;
}

const variantToElement = {
    h1: ({ text, ...props }: any) => <h1 {...props}>{text}</h1>,
    h2: ({ text, ...props }: any) => <h2 {...props}>{text}</h2>,
    h3: ({ text, ...props }: any) => <h3 {...props}>{text}</h3>,
    h4: ({ text, ...props }: any) => <h4 {...props}>{text}</h4>,
    h5: ({ text, ...props }: any) => <h5 {...props}>{text}</h5>,
    h6: ({ text, ...props }: any) => <h6 {...props}>{text}</h6>,
};

const Heading: React.FC<HeadingProps> = props => {
    const { variant, text } = props;
    const { translate } = useTranslations();
    const classes = merge(cssIf(css.textCenter, !!props.center), css[`variant-${variant}`], props.className);

    const H = variantToElement[variant || "h2"];
    return <H text={props.noTranslation ? text : translate(text)} className={classes} />;
};

export default React.memo(Heading);
