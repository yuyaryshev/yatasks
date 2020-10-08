import { ProviderContext, SnackbarMessage, VariantType } from "notistack";

let providerContext: ProviderContext | undefined;

export function notificationSetup(v: any) {
    providerContext = v;
}

export type SeverityEx = "F" | "E" | "W" | "I" | "D" | "S";

export function notification(cpl: string, severityEx: SeverityEx, message: SnackbarMessage, hideSnack?: boolean) {
    const severity = severityEx === "S" ? "I" : severityEx;
    if (providerContext) {
        let variant: VariantType = "info";
        switch (severityEx) {
            case "F":
            case "E":
                variant = "error";
                break;
            case "W":
                variant = "warning";
                break;
            case "S":
                variant = "success";
                break;
        }
        providerContext.enqueueSnackbar(message, { variant });
    }

    if (typeof message === "string") {
        const fullMessage = `${cpl} ${message}`;
        switch (severity) {
            case "F":
                console.trace(fullMessage);
                break;
            case "E":
                console.error(fullMessage);
                break;
            case "W":
                console.warn(fullMessage);
                break;
            default:
                console.log(fullMessage);
                break;
        }
    }
}

export function notificationSuccess(cpl: string, s: string) {
    notification(cpl, "S", s);
}
export function notificationInfo(cpl: string, s: string) {
    notification(cpl, "I", s);
}
export function notificationWarn(cpl: string, s: string) {
    notification(cpl, "W", s);
}
export function notificationError(cpl: string, s: string) {
    notification(cpl, "E", s);
}

export interface NotificationResponse {
    data: {
        error?: any;
        warn?: any;
        ok?: any;
    };
}

function extractMessage(v: any): string | undefined {
    if (typeof v === "string" && v.length) return v;
    if (v && typeof v === "object") {
        if (v.message === "string" && v.message.length) return v.message;
        if (v.msg === "string" && v.msg.length) return v.msg;
        if (v.code === "string" && v.code.length) return v.code;
    }
    return undefined;
}

export function notificationFromResponse(
    cpl: string,
    response: NotificationResponse,
    ui_success_message?: string,
    ui_error_message?: string
) {
    const { data } = response;
    if (data.warn) notificationWarn(cpl, extractMessage(data.warn) || `${ui_success_message || ""} with warning!`);
    else if (data.ok) notificationSuccess(cpl, ui_success_message || extractMessage(response) || `OK!`);
    else notificationError(cpl, ui_error_message || extractMessage(data.error) || `${cpl} Unknown error!`);
}
