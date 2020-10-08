export type ExpectOneCallback<T, R> = (item: T, index: number) => R | undefined;

export function expectOne<T, R>(container: T[] | Set<T>, filterFunc: ExpectOneCallback<T, R>): R {
    let index = 0;
    let r: R | undefined;
    for (let item of container) {
        const r2 = filterFunc(item, index);
        if (r2) {
            if (r === undefined) r = r2;
            else throw new Error(`CODE00000294 expectOne failed - more than one result!`);
        }
        index++;
    }
    if (r === undefined) throw new Error(`CODE00000295 expectOne failed - item not found!`);
    return r;
}
