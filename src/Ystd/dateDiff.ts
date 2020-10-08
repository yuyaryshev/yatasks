// a - b returns diff in milliseconds
export const dateDiff = (a: Date | string, b: Date | string): number => {
    let a2: Date = typeof a === "string" ? new Date(a) : a;
    let b2: Date = typeof b === "string" ? new Date(b) : b;
    return a2.getTime() - b2.getTime();
};

// adds milliseconds to date
export const dateAdd = (date: Date, milliseconds: number) => {
    date.setTime(date.getTime() + milliseconds);
    return date;
};
