import React from "react";
import { useObserver } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import debugjs from "debug";
import { ytheme } from "./ytheme";
import { ActionAreaModel } from "../models/ActionAreaModel";
import { setter } from "../models/editFunctions";

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

export const ActionArea: React.FC<{ m: ActionAreaModel }> = ({ m }) => {
    return useObserver(() => {
        const classes = useStyles();
        debugRender("ActionArea");

        return (
            <>
                <TextField
                    className={classes.textField}
                    label="Создать задачу"
                    multiline
                    variant="outlined"
                    value={m.newTaskText}
                    onChange={setter(m, "newTaskText")}
                    onKeyDown={m.onNewTaskTextKeyDown}
                />
            </>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
