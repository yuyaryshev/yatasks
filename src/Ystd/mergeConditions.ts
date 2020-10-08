export function mergeConditions(conds: (string | null | undefined)[], sep: string) {
    const r = conds.filter((cond) => cond && cond.length).join(sep);
    return r.length ? "(" + r + ")" : "";
}
