import React from "react";
import { useObserver } from "mobx-react-lite";
import Typography from "@material-ui/core/Typography";
import { createStyles, fade, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import InputBase from "@material-ui/core/InputBase";

import debugjs from "debug";
import { MainModel } from "../models/index.js";
import { TaskList } from "./TaskList.js";
import { ActionArea } from "./ActionArea.js";
import { ytheme } from "./ytheme.js";
import { TaskForm } from "./TaskForm.js";

const debugRender = debugjs("render");

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        gridContainer: {
            display: "grid",
            // gridTemplateAreas: `
            // "header header header"
            // "calendar main rightArea"
            // "calendar main rightArea"
            // `,
            gridTemplateAreas: `
            "header header header"
            "calendar main currentTasks"
            "calendar main actions"
            `,
            gridTemplateColumns: "1fr 3fr 1fr",
            gridTemplateRows: "64px auto 220px",
            width: "100%",
            height: "100%",
        },
        projects: {},
        fileTree: {},
        header: {
            gridArea: "header",
        },
        calendarArea: {
            gridArea: "calendar",
            // display: "flex",
            // flexDirection: "column",
            padding: ytheme.padding4,
            margin: ytheme.margin3,
            display: "flex",
            flexDirection: "column",
        },
        mainArea: {
            gridArea: "main",
            // display: "flex",
            // flexDirection: "column",
            padding: ytheme.padding4,
            margin: ytheme.margin3,
            display: "flex",
            flexDirection: "column",
        },
        rightArea: {
            gridArea: "rightArea",
            display: "flex",
            flexFlow: "column",
            // height: "300px",
        },
        rightAreaBody: {
            flex: "1 1 auto",
            overflow: "auto",
        },
        rightAreaFooter: {
            flex: "0 1 220px",
            // minHeight: 60px
        },
        currentTasksArea: {
            gridArea: "currentTasks",
            // display: "flex",
            // flexDirection: "column",
            padding: ytheme.padding4,
            margin: ytheme.margin3,
            display: "flex",
            flexDirection: "column",
            height: "330px", // css wa
        },
        actionArea: {
            gridArea: "actions",
            // display: "flex",
            // flexDirection: "column",
            padding: ytheme.padding4,
            margin: ytheme.margin3,
            display: "flex",
            flexDirection: "column",
        },
        editor: {
            width: "100%",
            height: "100%",
            gridArea: "editor",
        },
        editor2: {
            width: "100%",
            height: "100%",
        },
        root: {
            flexGrow: 1,
            width: "100%",
            height: "100%",
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        button: {},
        list: {
            width: 250,
        },
        search: {
            position: "relative",
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            "&:hover": {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: "100%",
            [theme.breakpoints.up("sm")]: {
                marginLeft: theme.spacing(3),
                width: "auto",
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        inputRoot: {
            color: "inherit",
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create("width"),
            width: "100%",
            [theme.breakpoints.up("md")]: {
                width: "20ch",
            },
        },
    })
);

export const MainPage: React.FC<{ m: MainModel }> = ({ m }) => {
    return useObserver(() => {
        const classes = useStyles();
        debugRender("MainPage");

        return (
            <>
                <div className={classes.gridContainer}>
                    <AppBar className={classes.header} position="static">
                        <Toolbar>
                            <IconButton
                                className={classes.menuButton}
                                edge="start"
                                onClick={m.toggleDrawer}
                                color="inherit"
                                aria-label="menu"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography className={classes.title} variant="h6" noWrap>
                                Ya Tasks
                            </Typography>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Найти…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </div>
                            {/*<Typography variant="h6" className={classes.title}>*/}
                            {/*TODO*/}
                            {/*</Typography>*/}
                            <Button
                                color="inherit"
                                onClick={() => {
                                    console.log("ideMain.sendAuthExit");
                                }}
                            >
                                Logout
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Paper className={classes.calendarArea} square>
                        testField.rawValue: {m.testField}
                        <Typography>TBD calendarArea</Typography>
                    </Paper>
                    <Paper className={classes.mainArea} square elevation={3}>
                        {!m.currentTask ? <Typography>No task selected...</Typography> : <TaskForm m={m.currentTask} />}
                    </Paper>
                    <div className={classes.currentTasksArea}>
                        <TaskList m={m.tasks} selectorObj={m} selectorProp="currentTask" />
                    </div>
                    <Paper className={classes.actionArea} square>
                        <ActionArea m={m.actionAreaModel} />
                    </Paper>
                </div>
            </>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
