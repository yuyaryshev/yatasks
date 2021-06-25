import React from "react";
import { observable } from "mobx";
import { useObserver } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import debugjs from "debug";
import { ytheme } from "./ytheme.js";

const debugRender = debugjs("render");

const useStyles = makeStyles({
    surveyHeaderPaper: {
        padding: ytheme.padding2,
        margin: ytheme.margin2,
        alignSelf: "center",
    },
    surveyFinishButton: {
        margin: ytheme.finishButtonMargin,
        alignSelf: "center",
        fontSize: "1.5rem",
    },
});

export interface MessageBoxHolder {
    messageBoxModel: MessageBoxModel | undefined;
}

export type MessageBoxResult = boolean | undefined;
export class MessageBoxModel {
    @observable visible: boolean = false;
    @observable name: string = "";
    @observable text: string = "";
    @observable okOnly: boolean = false;
    @observable okCancel: boolean = true;
    @observable yesNo: boolean = false;
    @observable result: MessageBoxResult = undefined;

    constructor(
        readonly resolvePromise: (v: MessageBoxResult) => void,
        readonly closePromise: Promise<MessageBoxResult>,
        readonly holder: MessageBoxHolder
    ) {}
}

export interface MessageBoxOpts {
    name: string;
    text?: string;
    okOnly?: boolean;
    okCancel?: boolean;
    yesNo?: boolean;
}

export type MessageBoxFunc = (opts0: string | MessageBoxOpts) => Promise<MessageBoxResult>;

export function registerMessageBox(holder: MessageBoxHolder) {
    return async function showDialog(opts0: string | MessageBoxOpts) {
        const opts = typeof opts0 === "string" ? { name: opts0, text: opts0, okCancel: true } : opts0;
        if (holder.messageBoxModel) throw new Error(`CODE00000114 Another modal window is already shown!`);

        if (!opts.yesNo && !opts.okOnly) {
            opts.okCancel = true;
        }
        let resolve: ((v: any) => void) | undefined;
        const promise = new Promise<MessageBoxResult>((p_resolve) => {
            resolve = p_resolve;
        });

        const m = (holder.messageBoxModel = new MessageBoxModel(resolve!, promise, holder));
        m.name = opts.name;
        m.text = opts.text || opts.name;
        m.okOnly = !!opts.okOnly;
        m.okCancel = !!opts.okCancel;
        m.yesNo = !!opts.yesNo;
        m.result = undefined;
        m.visible = true;
        return promise;
    };
}

export const MessageBox: React.FC<{ messageBoxModel: MessageBoxModel | undefined }> = ({ messageBoxModel }) => {
    const { name, text, okCancel: okCancel0, yesNo } = messageBoxModel || {};
    const okCancel = okCancel0 || !yesNo;

    const handleClose1 = () => {
        if (messageBoxModel) {
            messageBoxModel.visible = false;
            messageBoxModel.result = true;
            messageBoxModel.resolvePromise(messageBoxModel.result);
        }
    };

    const handleClose0 = () => {
        if (messageBoxModel) {
            messageBoxModel.visible = false;
            messageBoxModel.result = false;
            messageBoxModel.resolvePromise(messageBoxModel.result);
        }
    };

    return useObserver(() => {
        const classes = useStyles();
        debugRender("MessageBox");
        if (!messageBoxModel) return null;

        const name2 = name;
        return (
            <Dialog open={messageBoxModel.visible} onClose={handleClose0}>
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>{text}</DialogContentText>
                    {/*<TextField*/}
                    {/*    autoFocus*/}
                    {/*    margin="dense"*/}
                    {/*    id="name"*/}
                    {/*    label="Email Address"*/}
                    {/*    type="email"*/}
                    {/*    fullWidth*/}
                    {/*/>*/}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose1} color="primary">
                        {okCancel ? "Ok" : ""}
                        {yesNo ? "Yes" : ""}
                    </Button>
                    <Button onClick={handleClose0} color="primary">
                        {okCancel ? "Cancel" : ""}
                        {yesNo ? "No" : ""}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}

//     @observable knownErrors = [];
