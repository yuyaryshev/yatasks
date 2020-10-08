// import {
//     EditableBooleanOpts,
//     EditableDateOpts, EditableDurationOpts,
//     EditableEnumStrOpts, EditableLabelsOpts,
//     EditableLinkOpts, EditableMultiLinkOpts,
//     EditableStringOpts,
// } from "./ymeta";
// import { addEdited } from "./edited";
//
// export class EditableString {
//     public readonly et: "string" = "string";
//     public parent: any;
//     public prop: string = "";
//     @observable v: string;
//     set: (eventOrValue: any) => void;
//     get: () => string;
//     getSerialized: () => string;
//     clear: () => void;
//
//     constructor(public readonly opts: Partial<EditableStringOpts> = {}) {
//     this = opts.defaultValue || "";
//     const pthis = this;
//     this.set = function set(eventOrValue: any) {
//         pthis = (eventOrValue.target ? eventOrValue.target.value : eventOrValue) || "";
//         addEdited(pthis);
//     };
//
//     this.get = function get() {
//         return pthis.toString();
//     };
//
//     this.getSerialized = function get() {
//         return pthis.toString();
//     };
//
//     this.clear = function clear() {
//         pthis = opts.defaultValue || "";
//         addEdited(pthis);
//     };
// }
//
// toString() {
//     return this || "";
// }
// }
//
// export class EditableDate {
//     public readonly et: "date" = "date";
//     public parent: any;
//     public prop: string = "";
//
//     @observable v: Date | undefined;
//     set: (eventOrValue: any) => void;
//     get: () => Date | undefined;
//     getSerialized: () => string;
//     clear: () => void;
//
//     constructor(public readonly opts: Partial<EditableDateOpts> = {}) {
//     this = opts.defaultValue;
//     const pthis = this;
//     this.set = function set(eventOrValue: any) {
//         pthis = (eventOrValue.target ? eventOrValue.target.value : eventOrValue) || "";
//         addEdited(pthis);
//     };
//
//     this.get = function get(): Date | undefined {
//         return pthis;
//     };
//
//     this.getSerialized = function getSerialized(): string {
//         return (pthis && pthis.toISOString()) || "";
//     };
//
//     this.clear = function clear() {
//         pthis = opts.defaultValue;
//         addEdited(pthis);
//     };
// }
//
// toString() {
//     return this?.toISOString() || "";
// }
// }
//
// export class EditableEnumStr<T extends string> {
//     public readonly et: "enum" = "enum";
//     public parent: any;
//     public prop: string = "";
//
// @observable v: T;
//     set: (eventOrValue: any) => void;
//     get: () => T;
//     getSerialized: () => string;
//     clear: () => void;
//
//     constructor(public readonly opts: EditableEnumStrOpts<T>) {
//         if (!opts.values.length) {
//             const errorMessage = `CODE00000007 no values given to EditableEnumValue`;
//             console.trace(errorMessage);
//             throw new Error(errorMessage);
//         }
//         if (!opts.defaultValue) opts.defaultValue = opts.values[0];
//         this = opts.defaultValue;
//
//         const pthis = this;
//         this.set = function set(eventOrValue: any) {
//             const newValue = eventOrValue.target ? eventOrValue.target.value : eventOrValue;
//             if (!opts.values.includes(newValue)) {
//                 const errorMessage = `CODE00000008 incorrect newValue='${newValue}'`;
//                 console.trace(errorMessage);
//                 throw new Error(errorMessage);
//             }
//             pthis = newValue;
//             addEdited(pthis);
//         };
//
//         this.get = function get(): T {
//             return pthis;
//         };
//
//         this.getSerialized = function getSerialized(): T {
//             return pthis;
//         };
//
//         this.clear = function clear() {
//             pthis = opts.defaultValue!;
//             addEdited(pthis);
//         };
//     }
//
//     toString() {
//         return this;
//     }
// }
//
// export class EditableBoolean {
//     public readonly et: "boolean" = "boolean";
//     public parent: any;
//     public prop: string = "";
//
//     @observable v: boolean;
//     set: (eventOrValue: any, value?: boolean | undefined) => void;
//     toggle: () => boolean;
//     get: () => boolean;
//     getSerialized: () => number;
//     clear: () => void;
//
//     constructor(public readonly opts: Partial<EditableBooleanOpts> = { defaultValue: false }) {
//     if (opts.defaultValue === undefined) opts.defaultValue = false;
//     this = opts.defaultValue;
//
//     const pthis = this;
//     this.set = function set(eventOrValue: any, value?: boolean | undefined) {
//     if (value !== undefined) pthis = !!value;
//     else pthis = !!(eventOrValue.target ? eventOrValue.target.value : eventOrValue);
//     addEdited(pthis);
// };
//
// this.get = function get(): boolean {
//     return !!pthis;
// };
//
// this.getSerialized = function getSerialized(): number {
//     return !!pthis ? 1 : 0;
// };
//
// this.toggle = function toggle(): boolean {
//     return (pthis = !pthis);
//     addEdited(pthis);
// };
//
// this.clear = function clear() {
//     pthis = !!opts.defaultValue!;
//     addEdited(pthis);
// };
// }
//
// toString() {
//     return this ? "1" : "0";
// }
// }
//
// export class EditableLink<T extends { id: any }> {
//     public readonly et: "link" = "link";
//     public parent: any;
//     public prop: string = "";
// @observable v: T | undefined;
//     set: (eventOrValue: any) => void;
//     get: () => T | undefined;
//     getSerialized: () => string;
//     clear: () => void;
//
//     constructor(public readonly opts: EditableLinkOpts<T>) {
//         this = undefined;
//         const pthis = this;
//         this.set = function set(eventOrValue: any) {
//             const v1 = (eventOrValue.target ? eventOrValue.target.value : eventOrValue) || "";
//             //            const v2 = typeof v1 === "object" ? v1.id : v1;
//             pthis = v1;
//             addEdited(pthis);
//         };
//
//         this.get = function get() {
//             return pthis;
//         };
//
//         this.getSerialized = function get() {
//             return pthis?.id;
//         };
//
//         this.clear = function clear() {
//             pthis = undefined;
//             addEdited(pthis);
//         };
//     }
//
//     toString() {
//         return this ? this.opts.getTitle(this) : "";
//     }
// }
//
// export class EditableMultiLink<T extends { id: any }> {
//     public readonly et: "multiLink" = "multiLink";
//     public parent: any;
//     public prop: string = "";
// @observable v: T[] = [];
//     set: (event: any, value: T[] | T, reason: string) => void;
//     add: (eventOrValue: any) => void;
//     remove: (eventOrValue: any) => void;
//     get: () => T[];
//     getSerialized: () => string[];
//     clear: () => void;
//
//     constructor(public readonly opts: EditableMultiLinkOpts<T>) {
//         const pthis = this;
//         this.set = function set(event: any, newValue: T[] | T, reason: string) {
//             pthis = Array.isArray(newValue) ? newValue : [newValue];
//             addEdited(pthis);
//         };
//         this.add = function add(eventOrValue: any) {
//             const v1 = (eventOrValue.target ? eventOrValue.target.value : eventOrValue) || "";
//             const v2 = typeof v1 === "object" ? v1.id : v1;
//             if (v2) pthis.push(v2);
//             addEdited(pthis);
//         };
//         this.remove = function remove(eventOrValue: any) {
//             const v1 = (eventOrValue.target ? eventOrValue.target.value : eventOrValue) || "";
//             const v2 = typeof v1 === "object" ? v1.id : v1;
//             if (v2) {
//                 for (let i = 0; i < pthis.length; i++)
//                     if (v2.id === pthis[i].id) {
//                         pthis.splice(i, 1);
//                         break;
//                     }
//             }
//             addEdited(pthis);
//         };
//
//         this.get = function get() {
//             return pthis;
//         };
//
//         this.getSerialized = function get() {
//             return pthis.map((v) => v.id);
//         };
//
//         this.clear = function clear() {
//             pthis.length = 0;
//             addEdited(pthis);
//         };
//     }
//
//     toString() {
//         return this.map(this.opts.getTitle).join(", ");
//     }
// }
//
// export class EditableDuration {
//     public readonly et: "duration" = "duration";
//     public parent: any;
//     public prop: string = "";
//     @observable v: string; // duration iso string
//     set: (eventOrValue: any) => void;
//     get: () => string;
//     getSerialized: () => string;
//     clear: () => void;
//
//     constructor(public readonly opts: Partial<EditableDurationOpts> = {}) {
//     this = opts.defaultValue || "";
//     const pthis = this;
//     this.set = function set(eventOrValue: any) {
//         pthis = (eventOrValue.target ? eventOrValue.target.value : eventOrValue) || "";
//         addEdited(pthis);
//     };
//
//     this.get = function get() {
//         return pthis;
//     };
//
//     this.getSerialized = function get() {
//         return pthis;
//     };
//
//     this.clear = function clear() {
//         pthis = opts.defaultValue || "";
//         addEdited(pthis);
//     };
// }
//
// toString() {
//     return (this || 0).toString();
// }
// }
//
// export class EditableLabels {
//     public readonly et: "labels" = "labels";
//     public parent: any;
//     public prop: string = "";
//     @observable v: string[] = [];
//     set: (event: any, value: string[] | string, reason: string) => void;
//     get: () => string[];
//     getSerialized: () => string[];
//     clear: () => void;
//
//     constructor(public readonly opts: EditableLabelsOpts) {
//     const pthis = this;
//     this.set = function set(event: any, newValue: string[] | string, reason: string) {
//         pthis = Array.isArray(newValue) ? newValue : [newValue];
//         addEdited(pthis);
//     };
//
//     this.get = function get() {
//         return pthis;
//     };
//
//     this.getSerialized = function get() {
//         return pthis;
//     };
//
//     this.clear = function clear() {
//         pthis.length = 0;
//         addEdited(pthis);
//     };
// }
//
// toString() {
//     return this.join(" ");
// }
// }
//
// export type EditableValue =
// | EditableString
// | EditableBoolean
// | EditableDate
// | EditableEnumStr<any>
// | EditableLink<any>
// | EditableMultiLink<any>
// | EditableDuration
// | EditableLabels;
