import { parse } from "query-string";

export function apiUrl(): string {
    let t1 = window.location.origin.split("://");
    let t2 = t1[1].split(":");
    const r = t1[0] + "://" + t2[0] + ":4300";
    return r;
}

export function surveyIdFromUrl(): string {
    const parsed: any = parse(location.search);
    console.log("surveyIdFromUrl=", surveyIdFromUrl);
    return parsed.id;
}
