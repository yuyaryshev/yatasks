import React from "react";
import { useObserver } from "mobx-react-lite";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import debugjs from "debug";
import { ytheme } from "./ytheme.js";

const debugRender = debugjs("render");

const useStyles = makeStyles({
    surveyHeaderPaper: {
        padding: ytheme.padding2,
        margin: ytheme.margin2,
    },
    surveyFinishButton: {
        margin: ytheme.finishButtonMargin,
        alignSelf: "center",
        fontSize: "1.5rem",
    },
});

export const GlobalMessage: React.FC<{ m: any; messageText: string; name?: string }> = ({ m, messageText, name }) => {
    return useObserver(() => {
        const classes = useStyles();
        debugRender("GlobalMessage");

        const name2 = name || m.survey?.name;
        const descr = m.survey?.description;
        return (
            <>
                <Paper className={classes.surveyHeaderPaper}>
                    {name2 && name2.length ? <Typography variant="h3">{name2}</Typography> : undefined}
                    {descr && descr.length ? <Typography>{m.survey?.description}</Typography> : undefined}
                    <Typography>{messageText}</Typography>
                </Paper>
            </>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}

//     @observable knownErrors = [];
