import React from "react";
import { useObserver } from "mobx-react-lite";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import debugjs from "debug";
import { ytheme } from "./ytheme.js";
import { TaskModel } from "../models/TaskModel.js";
import { Editor } from "./Editor/index.js";

const debugRender = debugjs("render");

const useStyles = makeStyles({
    task: {
        padding: ytheme.padding4,
        margin: ytheme.margin3,
        display: "flex",
        flexDirection: "column",
    },
    typography: {
        margin: ytheme.margin4,
    },
    textField: {
        margin: ytheme.margin3,
    },
    rating: {
        margin: ytheme.margin3,
        fontSize: "4rem",
        alignSelf: "center",
    },
    checkBox: {
        margin: ytheme.margin3,
        fontSize: "4rem",
        alignSelf: "center",
    },
});

export const Task: React.FC<{ m: TaskModel }> = ({ m }) => {
    return useObserver(() => {
        const classes = useStyles();
        debugRender("Task");

        return (
            // GRP_task_fields
            <Paper className={classes.task} square>
                <Editor object={m} property="isFinished" />
                {m.description ? (
                    <>
                        <Typography>
                            <b>{m.name}</b>
                        </Typography>
                        <Typography>{m.description}</Typography>
                    </>
                ) : (
                    <Typography>{m.name}</Typography>
                )}
            </Paper>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
