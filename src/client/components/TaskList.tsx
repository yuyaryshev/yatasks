import React from "react";
import { useObserver } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import debugjs from "debug";
import { ytheme } from "./ytheme";
import { TaskListModel } from "../models/TaskListModel";
import { Task } from "./Task";
import { toggler } from "../models/editFunctions";

const debugRender = debugjs("render");

const useStyles = makeStyles({
    root: {
        // width: '100%',
        //        maxWidth: 360,
        //backgroundColor: theme.palette.background.paper,
        position: "relative",
        overflow: "auto",
    },
    task: {
        padding: ytheme.padding1,
        margin: ytheme.margin1,
        display: "flex",
        flexDirection: "column",
    },
    typography: {
        margin: ytheme.margin3,
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

export const TaskList: React.FC<{ m: TaskListModel; selectorObj?: any; selectorProp?: string }> = ({
    m,
    selectorObj,
    selectorProp,
}) => {
    return useObserver(() => {
        const classes = useStyles();
        debugRender("Task");

        return (
            <Paper className={classes.root}>
                {/*{m.items.map((item) => (*/}
                {/*    <Task key={item.uid} m={item} />*/}
                {/*))}*/}

                <List component="nav" aria-label="main mailbox folders">
                    {m.items.map((item) => (
                        <ListItem
                            key={item.uid}
                            button
                            selected={item === (selectorObj && selectorObj[selectorProp as any])}
                            onClick={
                                selectorObj && selectorProp
                                    ? (...args: any[]) => {
                                          console.log(`CODE00000115 onClick`, args);
                                          selectorObj[selectorProp] = item;
                                      }
                                    : undefined
                            }
                        >
                            <ListItemIcon>
                                <Checkbox checked={item.isFinished} onChange={toggler(item, "isFinished")} />
                                {/*<InboxIcon />*/}
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                            {/*<Value m={m.isFinished} />*/}
                            {/*{m.description ? (*/}
                            {/*    <>*/}
                            {/*        <Typography>*/}
                            {/*            <b>{m.name}</b>*/}
                            {/*        </Typography>*/}
                            {/*        <Typography>{m.description}</Typography>*/}
                            {/*    </>*/}
                            {/*) : (*/}
                            {/*    <Typography>{m.name}</Typography>*/}
                            {/*)}*/}
                        </ListItem>
                    ))}
                </List>
            </Paper>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
