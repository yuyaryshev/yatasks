import React from "react";
import { useObserver } from "mobx-react-lite";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import debugjs from "debug";

const debugRender = debugjs("render");

const useStyles = makeStyles({
    surveyHeaderPaper: {
        padding: "40px",
        margin: "16px",
    },
    surveyFinishButton: {
        margin: "16px",
        alignSelf: "center",
        fontSize: "1.5rem",
    },
});

// TODO UI Plan
export const Survey: React.FC<{ m: any }> = ({ m }) => {
    return useObserver(() => {
        const classes = useStyles();
        debugRender("Survey");

        return (
            <>
                <Paper className={classes.surveyHeaderPaper}>
                    <Typography variant="h3" align="center">
                        {m.name}
                    </Typography>
                    <Typography>{m.description}</Typography>
                </Paper>
                <Button
                    className={classes.surveyFinishButton}
                    variant="contained"
                    color="primary"
                    onClick={m.finishSurvey}
                >
                    Завершить опрос
                </Button>
            </>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}

//     @observable knownErrors = [];
