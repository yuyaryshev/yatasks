import React from "react";
import { useObserver } from "mobx-react-lite";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";

import debugjs from "debug";
import { TaskModel } from "../models/TaskModel";
import { Value } from "./Value";
import { ErrorBoundary } from "./ErrorBoundary";

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
                <Value m={m} prop="name" editor />
                <Value m={m} prop="description" editor />
                <Value m={m} prop="reviewDate" editor />
                <Value m={m} prop="parent" editor />
                <Value m={m} prop="result" editor />
                <Value m={m} prop="assignee" editor />
                <Value m={m} prop="reporter" editor />
                <FormGroup className={classes.flags}>
                    <Value m={m} prop="isAcceptedByAssignee" editor />
                    <Value m={m} prop="isInProgress" editor />
                    <Value m={m} prop="isFinished" editor />
                    <Value m={m} prop="isWaiting" editor />
                    <Value m={m} prop="isAcceptedByManager" editor />
                    <Value m={m} prop="isAcceptedByReporter" editor />
                    <Value m={m} prop="isSucceded" editor />
                </FormGroup>
                <FormGroup className={classes.flags}>
                    <Value m={m} prop="createdDate" editor />
                    <Value m={m} prop="startDate" editor />
                    <Value m={m} prop="endDate" editor />
                    <Value m={m} prop="dueDate" editor />
                    <Value m={m} prop="expectedStartDate" editor />
                    <Value m={m} prop="expectedEndDate" editor />
                </FormGroup>
                <Value m={m} prop="labels" editor />
                <Value m={m} prop="workDaysDuration" editor />
                <Value m={m} prop="calendarDaysDuration" editor />
                <Value m={m} prop="remainingEstimate" editor />
                <Value m={m} prop="epicLink" editor />
                <Value m={m} prop="jiraKey" editor />
                <Value m={m} prop="waitType" editor />
                <Value m={m} prop="waitDate" editor />
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
