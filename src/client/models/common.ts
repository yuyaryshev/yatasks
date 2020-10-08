import { DateTime, Settings } from "luxon";
import { withDisabledAddEdited } from "./edited";

Settings.defaultLocale = "ru";

export function reformatDate(t: any, prop: string) {
    t[prop] = t[prop] ? DateTime.fromISO(t[prop]).toFormat("HH:mm:ss - DD.MM.YYYY (dddd)") : "";
    return t[prop];
}

export function copyPrimitiveFields(target: any, source: any) {
    for (let k in source)
        if (target[k]?.et) {
            if (typeof source[k] !== "object" && target[k] !== source[k]) target[k].set(source[k]);
        } else {
            if (typeof source[k] !== "object" && target[k] !== source[k]) target[k] = source[k];
        }
}

export function syncArray(modelProp: any, dataProp: any, onNewModelItemFunc: (dataItem: any) => any) {
    withDisabledAddEdited(function () {
        L_outter: for (let i = modelProp.length - 1; i >= 0; i--) {
            for (let dataItem of dataProp) {
                if (typeof dataItem === "object") {
                    if (dataItem.id === modelProp[i].id) continue L_outter; // Item found - skip it
                } else {
                    if (dataItem === modelProp[i]) continue L_outter; // Item found - skip it
                }
            }
            modelProp.splice(i, 1); // Item not found, - delete it
        }

        for (let dataItem of dataProp) {
            let modelItem;
            for (let modelItemCandidate of modelProp) {
                if (modelItemCandidate.id === dataItem.id) {
                    modelItem = modelItemCandidate;
                    break;
                }
            }
            if (modelItem) modelItem.setData(dataItem);
            else {
                modelItem = onNewModelItemFunc(dataItem);
                modelItem.setData(dataItem);
                modelProp.push(modelItem);
            }
        }
    });
}

if ((module as any).hot) {
    (module as any).hot.accept();
}
