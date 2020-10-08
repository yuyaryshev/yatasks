import { observable } from "mobx";
import "reflect-metadata";

export interface EditableStringOpts {
    et: "string";
    defaultValue?: string;
    multiline?: boolean;
}

export interface EditableDateOpts {
    et: "date";
    defaultValue?: Date | undefined;
}

export interface EditableEnumStrOpts<T extends string> {
    et: "enum";
    defaultValue?: T;
    values: T[];
}

export interface EditableBooleanOpts {
    et: "boolean";
    defaultValue?: boolean;
}

export interface EditableLinkOpts<T extends { id: any }> {
    et: "link";
    defaultValue?: T;
    getAutocompleteItemsSync?: () => T[];
    getAutocompleteItemsAsync?: (query: string) => Promise<T[]>;
    getTitle: (v: T) => string;
}

export interface EditableMultiLinkOpts<T extends { id: any }> {
    et: "multilink";
    defaultValue?: T[];
    getAutocompleteItemsSync?: () => T[];
    getAutocompleteItemsAsync?: (query: string) => Promise<T[]>;
    getTitle: (v: T) => string;
}

export interface EditableDurationOpts {
    et: "duration";
    defaultValue?: string;
}

export interface EditableLabelsOpts {
    et: "labels";
    defaultValue?: string[];
    multiline?: boolean;
    getAutocompleteItemsSync: () => string[];
}

export const defaultDefaultValues = {
    string: "",
    date: undefined,
    enum: undefined,
    boolean: false,
    link: undefined,
    multilink: [],
    duration: undefined,
    labels: [],
};

export type EditableOpts =
    | EditableStringOpts
    | EditableDateOpts
    | EditableEnumStrOpts<any>
    | EditableBooleanOpts
    | EditableLinkOpts<any>
    | EditableMultiLinkOpts<any>
    | EditableDurationOpts
    | EditableLabelsOpts;

const editableMetaKey = Symbol("editable");

export function getEditableMeta(target: any, propertyKey: string): EditableOpts | undefined {
    return Reflect.getMetadata(editableMetaKey, target, propertyKey);
}
export function ymeta(opts0: EditableOpts): any {
    const opts = Object.assign(opts0, { defaultValue: defaultDefaultValues[opts0.et] }, opts0);
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
        Reflect.defineMetadata(editableMetaKey, opts, target, propertyKey);
        return observable(target, propertyKey, descriptor);
    };
}

if ((module as any).hot) {
    (module as any).hot.accept();
}

export interface Editable {
    id: number;
    uid: string;

    getTitle?: () => string;
}
