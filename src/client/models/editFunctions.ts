import { Editable, EditableOpts, getEditableMeta } from "./ymeta";
import { addEdited } from "./edited";

export interface ActionFuncs {
    setter?: (v: any) => void;
    toggler?: () => void;
    clearer?: () => void;
    constSetters?: Map<any, () => void>;
}

export interface ActionFuncsDict {
    [key: string]: ActionFuncs;
}

const actionFuncMap = new WeakMap<Editable, ActionFuncsDict>();

export function setter(target: any, prop: string, value?: any) {
    const ym = getEditableMeta(target, prop);
    if (!ym) throw new Error(`CODE00000005 target is not editable!`);

    let dict = actionFuncMap.get(target);
    if (!dict) actionFuncMap.set(target, (dict = { [prop]: {} }));
    const dictProp = dict[prop] || (dict[prop] = {});

    if (value !== undefined) {
        const constSetters = dictProp.constSetters || (dictProp.constSetters = new Map());
        let constSetter = constSetters.get(value);
        if (!constSetter)
            constSetters.set(
                value,
                (constSetter = function constSetterFunc() {
                    target[prop] = value;
                    addEdited(target, prop);
                })
            );
        return constSetter;
    }

    return (
        dictProp.setter ||
        (dictProp.setter = function setterFunc(eventOrValue: any) {
            const v =
                (eventOrValue && eventOrValue.target ? eventOrValue.target.value : eventOrValue) || ym.defaultValue;
            target[prop] = v;
            addEdited(target, prop);
        })
    );
}

export function clearProp(target: any, prop: string) {
    const ym = getEditableMeta(target, prop);
    if (!ym) throw new Error(`CODE00000006 target is not editable!`);
    target[prop] = ym.defaultValue;
    addEdited(target, prop);
}

export function clearer(target: any, prop: string) {
    const ym = getEditableMeta(target, prop);
    if (!ym) throw new Error(`CODE00000304 target is not editable!`);

    let dict = actionFuncMap.get(target);
    if (!dict) actionFuncMap.set(target, (dict = { [prop]: {} }));
    const dictProp = dict[prop] || (dict[prop] = {});
    return (
        dictProp.clearer ||
        (dictProp.clearer = function clearerFunc() {
            target[prop] = ym.defaultValue;
            addEdited(target, prop);
        })
    );
}

export function toggler(target: any, prop: string) {
    const ym = getEditableMeta(target, prop);
    if (!ym) throw new Error(`CODE00000305 target is not editable!`);

    let dict = actionFuncMap.get(target);
    if (!dict) actionFuncMap.set(target, (dict = { [prop]: {} }));
    const dictProp = dict[prop] || (dict[prop] = {});
    return (
        dictProp.toggler ||
        (dictProp.toggler = function togglerFunc() {
            target[prop] = !target[prop];
            addEdited(target, prop);
        })
    );
}

export type ChangerFunc = (
    target: any,
    prop: string,
    eventOrValue: any,
    ymeta: EditableOpts,
    ...changerArgs: any[]
) => void;
export function changer(target: any, prop: string, changer: ChangerFunc, ...changerArgs: any[]) {
    const ym = getEditableMeta(target, prop);
    if (!ym) throw new Error(`CODE00000306 target is not editable!`);
    const changerName = changer.name;
    if (!changer.name || !changer.name.length) throw new Error(`CODE00000113 changer function should have a name!`);

    let dict = actionFuncMap.get(target);
    if (!dict) actionFuncMap.set(target, (dict = { [prop]: {} }));
    const dictProp = dict[prop] || (dict[prop] = {});

    if (!changerArgs.length)
        return (
            (dictProp as any)[changerName] ||
            ((dictProp as any)[changerName] = function changerFunc(eventOrValue: any) {
                changer(target, prop, eventOrValue, ym);
                addEdited(target, prop);
            })
        );

    const changerFullName = changerName + changerArgs.join("_");
    return (
        (dictProp as any)[changerFullName] ||
        ((dictProp as any)[changerFullName] = function changerFunc(eventOrValue: any) {
            changer(target, prop, eventOrValue, ym, ...changerArgs);
            addEdited(target, prop);
        })
    );
}
