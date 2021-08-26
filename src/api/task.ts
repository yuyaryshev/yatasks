import { AckPacket } from "../types/common.types";
import { array, boolean, Decoder, number, object, optional, string } from "@mojotech/json-type-validation";
import {
    decoderPartialSerializedTask,
    decoderSerializedTask,
    PartialSerializedTask,
    SerializedTask,
} from "../domains/index.js";

//----------------------------------------------------------------------------------------------------
export interface SearchTaskApiRequest {
    q: string;
}
export const decoderSearchApiRequest: Decoder<SearchTaskApiRequest> = object({
    q: string(),
});

export interface SearchApiResponse extends AckPacket {
    tasks: SerializedTask[];
    totalCount: number;
}
export const decoderSearchApiResponse: Decoder<SearchApiResponse> = object({
    ok: boolean(),
    error: optional(string()),
    tasks: array(decoderSerializedTask),
    totalCount: number(),
});
//----------------------------------------------------------------------------------------------------
export interface CurrentTasksApiRequest {}
export const decoderCurrentTasksApiRequest: Decoder<CurrentTasksApiRequest> = object({});

export interface CurrentTasksApiResponse extends AckPacket {
    tasks: SerializedTask[];
    totalCount: number;
}
export const decoderCurrentTasksApiResponse: Decoder<CurrentTasksApiResponse> = object({
    ok: boolean(),
    error: optional(string()),
    tasks: array(decoderSerializedTask),
    totalCount: number(),
});
//----------------------------------------------------------------------------------------------------
export interface TaskGetApiRequest {
    id: number;
    uid: string;
}
export const decoderTaskGetApiRequest: Decoder<TaskGetApiRequest> = object({
    id: number(),
    uid: string(),
});

export interface TaskGetApiResponse extends AckPacket {
    task: SerializedTask;
}
export const decoderTaskGetApiResponse: Decoder<TaskGetApiResponse> = object({
    ok: boolean(),
    error: optional(string()),
    task: decoderSerializedTask,
});
//----------------------------------------------------------------------------------------------------
export interface TaskPostApiRequest {
    tasks: PartialSerializedTask[];
}
export const decoderTaskPostApiRequest: Decoder<TaskPostApiRequest> = object({
    tasks: array(decoderPartialSerializedTask),
});

export interface TaskPostApiResponse extends AckPacket {}
export const decoderTaskPostApiResponse: Decoder<TaskPostApiResponse> = object({
    ok: boolean(),
    error: optional(string()),
});
//----------------------------------------------------------------------------------------------------
export interface TasksAllLabelsApiRequest {}
export const decoderTasksAllLabelsApiRequest: Decoder<TasksAllLabelsApiRequest> = object({});

export interface TasksAllLabelsApiResponse extends AckPacket {
    labels: string[];
}
export const decoderTasksAllLabelsApiResponse: Decoder<TasksAllLabelsApiResponse> = object({
    ok: boolean(),
    error: optional(string()),
    labels: array(string()),
    totalCount: number(),
});
//----------------------------------------------------------------------------------------------------
