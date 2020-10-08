export function nonEmptyStr(a: string | undefined | null): boolean {
    return !!(a && a.length);
}
