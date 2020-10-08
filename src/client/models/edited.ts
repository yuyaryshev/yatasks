export let CHANGES_AGGREGATION_INTERVAL = 2000;
export let MAX_CHANGES_AGGREGATION_INTERVAL = 20000;

export type EditedObjects = Map<any, any>;
let editedObjects: EditedObjects = new Map();
export type SendChangesHandler = (changes: EditedObjects) => Promise<void> | void;
let sendChangesHandler: SendChangesHandler | undefined;
let timerHandle: any;
let maxDelayTimerHandle: any;

export function addSendChangesHandler(v: SendChangesHandler) {
    sendChangesHandler = v;
}

export function privateSendChangesHandler() {
    if (timerHandle) {
        clearTimeout(timerHandle);
        timerHandle = undefined;
    }
    if (maxDelayTimerHandle) {
        clearTimeout(maxDelayTimerHandle);
        maxDelayTimerHandle = undefined;
    }
    if (sendChangesHandler) {
        const oldEditedObjects = editedObjects;
        editedObjects = new Map<any, any>();
        sendChangesHandler(oldEditedObjects);
    }
}

let v_disableAddEdited: boolean = false;
export function withDisabledAddEdited(callback: () => void) {
    if (!v_disableAddEdited) {
        v_disableAddEdited = true;
        callback();
        v_disableAddEdited = false;
    } else callback();
}

export function hasEdited() {
    return !!editedObjects.size;
}

export function addEdited(editable: any, prop: string) {
    if (v_disableAddEdited) return;

    let o: any = editedObjects.get(editable.parent);
    if (!o)
        editedObjects.set(
            editable.parent,
            (o = {
                id: editable.parent?.id,
                uid: editable.parent?.uid,
            })
        );
    o[editable.prop] = editable;
    if (timerHandle) clearTimeout(timerHandle);
    timerHandle = setTimeout(privateSendChangesHandler, CHANGES_AGGREGATION_INTERVAL);

    if (!maxDelayTimerHandle)
        maxDelayTimerHandle = setTimeout(privateSendChangesHandler, MAX_CHANGES_AGGREGATION_INTERVAL);
}
