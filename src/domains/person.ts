import { deserializeField, Table } from "./commonDbUtils.js";
import { constant, Decoder, number, object, oneOf, optional, string } from "@mojotech/json-type-validation";

export type PersonType = "team" | "other";
export const PersonTypeValues: PersonType[] = ["team", "other"];
export const decoderPersonType: Decoder<PersonType> = oneOf(constant("team"), constant("other"));

export const personTable: Table = {
    name: "person",
    columns: [
        // GRP_person_fields
        {
            name: "id",
            type: "integer",
        },
        {
            name: "uid",
            type: "text",
        },
        {
            name: "type",
            type: "text",
        },
        {
            name: "name",
            type: "text",
        },
        {
            name: "description",
            type: "text",
        },
        {
            name: "reviewDate",
            type: "date",
        },
    ],
};

export interface SerializedPerson {
    // GRP_person_fields
    stype: "person";
    id: number;
    uid: string;
    name: string;
    type: PersonType;
    description: string | undefined;
    reviewDate: string | undefined;
}
export const decoderSerializedPerson: Decoder<SerializedPerson> = object({
    // GRP_person_fields
    stype: constant("person"),
    id: number(),
    uid: string(),
    name: string(),
    type: decoderPersonType,
    description: optional(string()),
    reviewDate: optional(string()),
});

export interface PartialSerializedPerson {
    // GRP_person_fields
    stype: "person";
    id: number;
    uid: string;
    name: string | undefined;
    type: PersonType | undefined;
    description: string | undefined;
    reviewDate: string | undefined;
}
export const decoderPartialSerializedPerson: Decoder<PartialSerializedPerson> = object({
    // GRP_person_fields
    stype: constant("person"),
    id: number(),
    uid: string(),
    name: optional(string()),
    type: optional(decoderPersonType),
    description: optional(string()),
    reviewDate: optional(string()),
});

export function rowToSerializedPerson(r: any): SerializedPerson {
    for (let k in r) deserializeField(personTable, r, k);
    r.stype = "person";
    return decoderSerializedPerson.runWithException(r);
}
