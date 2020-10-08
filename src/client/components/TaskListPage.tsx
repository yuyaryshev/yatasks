import React from "react";
import { useObserver } from "mobx-react-lite";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import debugjs from "debug";
import { TaskListModel } from "../models/TaskListModel";

const debugRender = debugjs("render");

const useStyles = makeStyles({
    TaskListHeaderPaper: {
        padding: "40px",
        margin: "16px",
    },
    surveyFinishButton: {
        margin: "16px",
        alignSelf: "center",
        fontSize: "1.5rem",
    },
});

// TODO UI TaskList
export const TaskListPage: React.FC<{ m: TaskListModel }> = ({ m }) => {
    return useObserver(() => {
        const classes = useStyles();
        debugRender("TaskList");

        return (
            <>
                <Paper className={classes.TaskListHeaderPaper}>
                    <Typography variant="h3" align="center">
                        "TBD Task List Page"
                    </Typography>
                </Paper>
            </>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}

//     @observable knownErrors = [];
