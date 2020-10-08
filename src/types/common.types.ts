import { boolean, Decoder, object, optional, string } from "@mojotech/json-type-validation";

export interface AckPacket {
    ok: boolean;
    error?: string;
}

export const decoderAckPacket: Decoder<AckPacket> = object({
    ok: boolean(),
    error: optional(string()),
});
