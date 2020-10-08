export function strNvl(a: string | undefined | null, b: string): string {
    return a && a.length ? a : b;
}

export function strNvlT(
    strings: TemplateStringsArray,
    ...args: (string | undefined | null | number | boolean)[]
): string {
    let r = "";
    for (let a of args)
        if (a === null || a === undefined || a === false || (typeof a === "string" && !a.length)) return "";

    for (let i = 0; i < strings.length; i++) {
        r += strings[i];
        if (args[i] !== null && args[i] !== undefined) r += args[i];
    }
    return r;
}
