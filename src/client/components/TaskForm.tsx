import React, { useState } from "react";
import { useObserver } from "mobx-react-lite";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";

import debugjs from "debug";
import { TaskModel } from "../models/TaskModel";
import { Editor } from "./Editor";
import { ErrorBoundary } from "./ErrorBoundary";
import { changer, setter } from "../models/editFunctions";
import { dateChanger } from "./Editor/DateEditor";

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
    flags: {
        padding: "16px",
    },
    dates: {
        padding: "16px",
    },
});

// TODO UI TaskForm
export const TaskForm: React.FC<{ m: TaskModel }> = ({ m }) => {
    return useObserver(() => {
        debugRender("TaskForm");
        const classes = useStyles();
        return (
            <div>
                // GRP_task_fields
                <Typography>id={m.id}</Typography>
                <Typography>uid={m.uid}</Typography>
                <Typography>name={m.name}</Typography>
                <Editor object={m} property="name" editor />
                <Editor object={m} property="description" editor />
                <Editor object={m} property="parent" editor />
                <Editor object={m} property="result" editor />
                <Editor object={m} property="assignee" editor />
                <Editor object={m} property="reporter" editor />
                <FormGroup className={classes.flags}>
                    <Editor object={m} property="isAcceptedByAssignee" editor />
                    <Editor object={m} property="isInProgress" editor />
                    <Editor object={m} property="isFinished" editor />
                    <Editor object={m} property="isWaiting" editor />
                    <Editor object={m} property="isAcceptedByManager" editor />
                    <Editor object={m} property="isAcceptedByReporter" editor />
                    <Editor object={m} property="isSucceded" editor />
                </FormGroup>
                <FormGroup className={classes.flags}>
                    <Editor object={m} property="createdDate" editor />
                    <Editor object={m} property="startDate" editor />
                    <Editor object={m} property="endDate" editor />
                    <Editor object={m} property="dueDate" editor />
                    <Editor object={m} property="expectedStartDate" editor />
                    <Editor object={m} property="expectedEndDate" editor />
                </FormGroup>
                <Editor object={m} property="labels" editor />
                <Editor object={m} property="workDaysDuration" editor />
                <Editor object={m} property="calendarDaysDuration" editor />
                <Editor object={m} property="remainingEstimate" editor />
                <Editor object={m} property="epicLink" editor />
                <Editor object={m} property="jiraKey" editor />
                <Editor object={m} property="waitType" editor />
                <Editor object={m} property="waitDate" editor />
                <Editor object={m} property="testlink" editor />

                {/*<Button*/}
                {/*    className={classes.surveyFinishButton}*/}
                {/*    variant="contained"*/}
                {/*    color="primary"*/}
                {/*    onClick={()=>{}}*/}
                {/*>*/}
                {/*    Завершить опрос*/}
                {/*</Button>*/}
            </div>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}

//     @observable knownErrors = [];
