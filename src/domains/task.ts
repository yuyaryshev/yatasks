import { deserializeField, Table } from "./commonDbUtils";
import {
    array,
    boolean,
    constant,
    Decoder,
    number,
    object,
    oneOf,
    optional,
    string,
} from "@mojotech/json-type-validation";

export type TaskType = "plain" | "control";
export const TaskTypeValues: TaskType[] = ["plain", "control"];
export const decoderTaskType: Decoder<TaskType> = oneOf(constant("plain"), constant("control"));

export type WaitType = "prereq" | "time";
export const WaitTypeValues: WaitType[] = ["prereq", "time"];
export const decoderWaitType: Decoder<WaitType> = oneOf(constant("prereq"), constant("time"));

export const taskTable: Table = {
    name: "task",
    columns: [
        // GRP_task_fields
        { name: "id", type: "integer" },
        { name: "uid", type: "text" },
        { name: "type", type: "text" },
        { name: "name", type: "text" },
        { name: "description", type: "text" },
        { name: "reviewDate", type: "date" },
        { name: "parent", type: "text" },
        { name: "result", type: "text" },
        { name: "assignee", type: "text" },
        { name: "reporter", type: "text" },
        { name: "isAcceptedByAssignee", type: "boolean" },
        { name: "isInProgress", type: "boolean" },
        { name: "isFinished", type: "boolean" },
        { name: "isWaiting", type: "boolean" },
        { name: "isAcceptedByManager", type: "boolean" },
        { name: "isAcceptedByReporter", type: "boolean" },
        { name: "isSucceded", type: "boolean" },
        { name: "labels", type: "text" },
        { name: "workDaysDuration", type: "numeric" },
        { name: "calendarDaysDuration", type: "numeric" },
        { name: "remainingEstimate", type: "numeric" },
        { name: "createdDate", type: "text" },
        { name: "startDate", type: "text" },
        { name: "endDate", type: "text" },
        { name: "dueDate", type: "text" },
        { name: "expectedStartDate", type: "text" },
        { name: "expectedEndDate", type: "text" },
        { name: "epicLink", type: "text" },
        { name: "jiraKey", type: "text" },
        { name: "waitType", type: "text" },
        { name: "waitDate", type: "text" },
    ],
};

export interface SerializedTask {
    // GRP_task_fields
    stype: "task";
    id: number;
    uid: string;
    name: string;
    type: TaskType;
    description: string | undefined;
    reviewDate: string | undefined;

    parent: string | undefined;
    result: string | undefined;
    assignee: string | undefined;
    reporter: string | undefined;
    isAcceptedByAssignee: boolean;
    isInProgress: boolean;
    isFinished: boolean;
    isWaiting: boolean;
    isAcceptedByManager: boolean;
    isAcceptedByReporter: boolean;
    isSucceded: boolean;
    labels: string[] | undefined;
    workDaysDuration: string | undefined;
    calendarDaysDuration: string | undefined;
    remainingEstimate: string | undefined;
    createdDate: string | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    dueDate: string | undefined;
    expectedStartDate: string | undefined;
    expectedEndDate: string | undefined;
    epicLink: string | undefined;
    jiraKey: string | undefined;
    waitType: string | undefined;
    waitDate: string | undefined;
}
export const decoderSerializedTask: Decoder<SerializedTask> = object({
    // GRP_task_fields
    stype: constant("task"),
    id: number(),
    uid: string(),
    name: string(),
    type: decoderTaskType,
    description: optional(string()),
    reviewDate: optional(string()),

    parent: optional(string()),
    result: optional(string()),
    assignee: optional(string()),
    reporter: optional(string()),
    isAcceptedByAssignee: boolean(),
    isInProgress: boolean(),
    isFinished: boolean(),
    isWaiting: boolean(),
    isAcceptedByManager: boolean(),
    isAcceptedByReporter: boolean(),
    isSucceded: boolean(),
    labels: optional(array(string())),
    workDaysDuration: optional(string()),
    calendarDaysDuration: optional(string()),
    remainingEstimate: optional(string()),
    createdDate: optional(string()),
    startDate: optional(string()),
    endDate: optional(string()),
    dueDate: optional(string()),
    expectedStartDate: optional(string()),
    expectedEndDate: optional(string()),
    epicLink: optional(string()),
    jiraKey: optional(string()),
    waitType: optional(string()),
    waitDate: optional(string()),
});

export interface PartialSerializedTask {
    // GRP_task_fields
    stype: "task";
    id: number;
    uid: string;
    name: string | undefined;
    type: TaskType | undefined;
    description: string | undefined;
    reviewDate: string | undefined;

    parent: string | undefined;
    result: string | undefined;
    assignee: string | undefined;
    reporter: string | undefined;
    isAcceptedByAssignee: boolean | undefined;
    isInProgress: boolean | undefined;
    isFinished: boolean | undefined;
    isWaiting: boolean | undefined;
    isAcceptedByManager: boolean | undefined;
    isAcceptedByReporter: boolean | undefined;
    isSucceded: boolean | undefined;
    labels: string[] | undefined;
    workDaysDuration: string | undefined;
    calendarDaysDuration: string | undefined;
    remainingEstimate: string | undefined;
    createdDate: string | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    dueDate: string | undefined;
    expectedStartDate: string | undefined;
    expectedEndDate: string | undefined;
    epicLink: string | undefined;
    jiraKey: string | undefined;
    waitType: string | undefined;
    waitDate: string | undefined;
}
export const decoderPartialSerializedTask: Decoder<PartialSerializedTask> = object({
    // GRP_task_fields
    stype: constant("task"),
    id: number(),
    uid: string(),
    name: optional(string()),
    type: optional(decoderTaskType),
    description: optional(string()),
    reviewDate: optional(string()),

    parent: optional(string()),
    result: optional(string()),
    assignee: optional(string()),
    reporter: optional(string()),
    isAcceptedByAssignee: optional(boolean()),
    isInProgress: optional(boolean()),
    isFinished: optional(boolean()),
    isWaiting: optional(boolean()),
    isAcceptedByManager: optional(boolean()),
    isAcceptedByReporter: optional(boolean()),
    isSucceded: optional(boolean()),
    labels: optional(array(string())),
    workDaysDuration: optional(string()),
    calendarDaysDuration: optional(string()),
    remainingEstimate: optional(string()),
    createdDate: optional(string()),
    startDate: optional(string()),
    endDate: optional(string()),
    dueDate: optional(string()),
    expectedStartDate: optional(string()),
    expectedEndDate: optional(string()),
    epicLink: optional(string()),
    jiraKey: optional(string()),
    waitType: optional(string()),
    waitDate: optional(string()),
});

export function rowToSerializedTask(r: any): SerializedTask {
    for (let k in r) deserializeField(taskTable, r, k);
    r.stype = "task";
    return decoderSerializedTask.runWithException(r);
}
