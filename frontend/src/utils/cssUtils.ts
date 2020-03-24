export const merge = (...css: (string | undefined)[]): string => css.filter(a => !!a).join(" ");

export const cssIf = (css: string, predicate: boolean): string => (predicate ? css : "");
