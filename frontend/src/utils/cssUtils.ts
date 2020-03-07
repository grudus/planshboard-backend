export const merge = (...css: string[]): string => css.join(" ");

export const cssIf = (css: string, predicate: boolean): string => (predicate ? css : "");
