import { AckPacket } from "../types/common.types";
import { array, boolean, Decoder, number, object, optional, string } from "@mojotech/json-type-validation";
import {
    decoderPartialSerializedPerson,
    decoderSerializedPerson,
    PartialSerializedPerson,
    SerializedPerson,
} from "../domains";

//----------------------------------------------------------------------------------------------------
export interface SearchPersonApiRequest {
    q: string;
}
export const decoderSearchPersonApiRequest: Decoder<SearchPersonApiRequest> = object({
    q: string(),
});

export interface SearchPersonApiResponse extends AckPacket {
    persons: SerializedPerson[];
    totalCount: number;
}
export const decoderSearchPersonApiResponse: Decoder<SearchPersonApiResponse> = object({
    ok: boolean(),
    error: optional(string()),
    persons: array(decoderSerializedPerson),
    totalCount: number(),
});
//----------------------------------------------------------------------------------------------------
export interface CurrentPersonsApiRequest {}
export const decoderCurrentPersonsApiRequest: Decoder<CurrentPersonsApiRequest> = object({});

export interface CurrentPersonsApiResponse extends AckPacket {
    persons: SerializedPerson[];
    totalCount: number;
}
export const decoderCurrentPersonsApiResponse: Decoder<CurrentPersonsApiResponse> = object({
    ok: boolean(),
    error: optional(string()),
    persons: array(decoderSerializedPerson),
    totalCount: number(),
});
//----------------------------------------------------------------------------------------------------
export interface PersonGetApiRequest {
    id: number;
    uid: string;
}
export const decoderPersonGetApiRequest: Decoder<PersonGetApiRequest> = object({
    id: number(),
    uid: string(),
});

export interface PersonGetApiResponse extends AckPacket {
    person: SerializedPerson;
}
export const decoderPersonGetApiResponse: Decoder<PersonGetApiResponse> = object({
    ok: boolean(),
    error: optional(string()),
    person: decoderSerializedPerson,
});
//----------------------------------------------------------------------------------------------------
export interface PersonPostApiRequest {
    persons: PartialSerializedPerson[];
}
export const decoderPersonPostApiRequest: Decoder<PersonPostApiRequest> = object({
    persons: array(decoderPartialSerializedPerson),
});

export interface PersonPostApiResponse extends AckPacket {}
export const decoderPersonPostApiResponse: Decoder<PersonPostApiResponse> = object({
    ok: boolean(),
    error: optional(string()),
});
//----------------------------------------------------------------------------------------------------
