export type DurationMs = number;
export type DurationEngStr = string;
export type DurationRusStr = string;
export interface DurationObj {
    sign?: number;
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}

export function durationEngStrToDurationObj(vv: DurationEngStr): DurationObj {
    let sign = 1;
    let years = 0;
    let quarters = 0;
    let months = 0;
    let weeks = 0;
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;

    for (let v of vv.split(" ")) {
        let [n, units] = (v.trim().match(/[0-9]+|[^0-9]+/gi) || [Number(v), "ms"]) as [number, string];
        if (n < 0) {
            sign = -1;
            n = -n;
        }
        if (units.length > 2) throw new Error(`Incorrect interval '${v}'`);
        switch (units) {
            case "ms":
            case "msec":
            case "MS":
            case "millisecond":
            case "milliseconds":
                milliseconds = n;
                break;
            case "s":
            case "sec":
            case "second":
            case "seconds":
            case "S":
                seconds = n;
                break;
            case "m":
            case "min":
            case "minutes":
            case "minute":
                minutes = n;
                break;
            case "h":
            case "hour":
            case "hours":
            case "H":
                hours = n;
                break;
            case "d":
            case "D":
                days = n;
                break;
            case "w":
            case "W":
            case "week":
            case "weeks":
                weeks = n;
                break;
            case "mth":
            case "month":
            case "months":
            case "M":
                months = n;
                break;
            case "y":
            case "year":
            case "years":
            case "Y":
                years = n;
                break;
            default:
                throw new Error(`Incorrect interval '${v}'`);
        }
    }
    const rr: DurationObj = {
        sign,
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
    };
    if (sign < 0) rr.sign = -1;
    return rr;
}

export function strIntervalsToDurationObjs(vv: DurationEngStr): DurationObj[] {
    let r: DurationObj[] = [];
    for (let v of vv.split(",")) r.push(durationEngStrToDurationObj(v));
    return r;
}

export function durationObjToEngStr(durationObj: DurationObj, maxParts: number = 3): DurationEngStr {
    const { sign, years, months, weeks, days, hours, minutes, seconds, milliseconds } = durationObj;
    const parts = [];
    if (years) parts.push(`${years}y`);
    if (months) parts.push(`${months}M`);
    if (weeks) parts.push(`${weeks}w`);
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds) parts.push(`${seconds}s`);
    if (milliseconds) parts.push(`${milliseconds}ms`);
    return ((sign || 1) < 0 ? "-" : "") + (maxParts ? parts.slice(0, maxParts) : parts).join(" ");
}

export interface AggDurationSettings {
    HoursPerDay?: number;
    DaysPerWeek?: number;
    DaysPerMonth?: number;
    WeeksPerMonth?: number;
    WeeksPerYear?: number;
    DaysPerYear?: number;
    MonthPerYear?: number;
}

export const strictWorkAggDurationSettings: AggDurationSettings = {
    HoursPerDay: 8,
    DaysPerWeek: 5,
};

export const approxWorkAggDurationSettings: AggDurationSettings = {
    HoursPerDay: 8,
    DaysPerWeek: 5,
    DaysPerMonth: 30,
    DaysPerYear: 365,
};

export const strict24_7_AggDurationSettings: AggDurationSettings = {
    HoursPerDay: 24,
    DaysPerWeek: 7,
};

export function aggDuration(durationObj: DurationObj, aggDurationSettings: AggDurationSettings = {}): DurationObj {
    let {
        HoursPerDay,
        DaysPerWeek,
        DaysPerMonth,
        DaysPerYear,
        WeeksPerMonth,
        WeeksPerYear,
        MonthPerYear,
    } = aggDurationSettings;
    let sign = durationObj.sign || 1;
    let years = durationObj.years || 0;
    let months = durationObj.months || 0;
    let weeks = durationObj.weeks || 0;
    let days = durationObj.days || 0;
    let hours = durationObj.hours || 0;
    let minutes = durationObj.minutes || 0;
    let seconds = durationObj.seconds || 0;
    let milliseconds = durationObj.milliseconds || 0;

    // prettier-ignore
    {
        let t;
                                t = Math.floor((milliseconds||0)/1000);  milliseconds -= t*1000;        seconds += t;
                                t = Math.floor((seconds||0)/60);         seconds -= t*60;               minutes += t;
                                t = Math.floor((minutes||0)/60);         minutes -= t*60;               hours += t;
        if(HoursPerDay) {       t = Math.floor((hours||0)/HoursPerDay);  hours -= t*HoursPerDay;         days += t;}
        if(DaysPerYear) {       t = Math.floor((days||0)/DaysPerYear);   days -= t*DaysPerYear;          years += t;}
        if(DaysPerMonth) {      t = Math.floor((days||0)/DaysPerMonth);  days -= t*DaysPerMonth;         months += t;}
        if(DaysPerWeek) {       t = Math.floor((days||0)/DaysPerWeek);   days -= t*DaysPerWeek;          weeks += t;}
        if(WeeksPerMonth) {     t = Math.floor((weeks||0)/WeeksPerMonth);weeks -= t*WeeksPerMonth;       months += t;}
        if(WeeksPerYear) {      t = Math.floor((weeks||0)/WeeksPerYear); weeks -= t*WeeksPerYear;        months += t;}
        if(MonthPerYear) {      t = Math.floor((months||0)/MonthPerYear); months -= t*MonthPerYear;      years += t;}
    }
    let rr: DurationObj = { years, months, weeks, days, hours, minutes, seconds, milliseconds };
    if (sign < 0) rr.sign = -1;
    return rr;
}

export function unaggDuration(durationObj: DurationObj, aggDurationSettings: AggDurationSettings): DurationObj {
    let {
        HoursPerDay,
        DaysPerWeek,
        DaysPerMonth,
        DaysPerYear,
        WeeksPerMonth,
        WeeksPerYear,
        MonthPerYear,
    } = aggDurationSettings;
    let sign = durationObj.sign || 1;
    let years = durationObj.years || 0;
    let months = durationObj.months || 0;
    let weeks = durationObj.weeks || 0;
    let days = durationObj.days || 0;
    let hours = durationObj.hours || 0;
    let minutes = durationObj.minutes || 0;
    let seconds = durationObj.seconds || 0;
    let milliseconds = durationObj.milliseconds || 0;

    // prettier-ignore
    {
        let t;
        if(years) {
            if(DaysPerYear) {days += years * DaysPerYear; years = 0;} else
            if(MonthPerYear) {months = years * MonthPerYear; years = 0;} else
            if(WeeksPerYear) {weeks += years * WeeksPerYear; years = 0;}
        }
        if(months) {
            if(DaysPerMonth) {days += months * DaysPerMonth; months = 0;} else
            if(WeeksPerMonth) {weeks += months * WeeksPerMonth; months = 0;}
        }
        if(weeks) {
            if(DaysPerWeek) {days += weeks * DaysPerWeek; weeks = 0;}
        }
        if(days) {
            if(HoursPerDay) {hours += days * HoursPerDay; days = 0;}
        }

        milliseconds += hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
        hours = 0;
        minutes = 0;
        seconds = 0;
    }
    const rr: DurationObj = { years, months, weeks, days, milliseconds };
    if (sign < 0) rr.sign = -1;
    return rr;
}

export function isOnlyMsDuration(durationObj: DurationObj | undefined) {
    if (!durationObj) return true;
    for (let k in durationObj) if (k !== "sign" && k !== "milliseconds" && (durationObj as any)[k]) return false;
    return true;
}
export function expectOnlyMsDuration(durationObj: DurationObj | undefined): DurationMs {
    if (!isOnlyMsDuration(durationObj))
        throw new Error(`CODE00000184 onlyMsDuration failed!\ndurationObj = ${JSON.stringify(durationObj)}`);
    return (durationObj?.milliseconds || 0) * (durationObj?.sign || 1);
}
