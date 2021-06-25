import React from "react";
import { useObserver } from "mobx-react-lite";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

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

export const Loading: React.FC<{ name: string }> = ({ name }) => {
    return useObserver(() => {
        const classes = useStyles();
        debugRender("GlobalMessage");

        const name2 = name;
        return (
            <>
                <Paper className={classes.surveyHeaderPaper}>
                    {name2 && name2.length ? (
                        <Typography variant="h3" align="center">
                            {name2}
                        </Typography>
                    ) : undefined}
                    <CircularProgress /> Загрузка...
                </Paper>
            </>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}

//     @observable knownErrors = [];
