import axios from "axios";
import { SerializedTask, TaskType, TaskTypeValues, WaitType, WaitTypeValues } from "../../domains";
import { copyPrimitiveFields, syncArray } from "./common";
import { v4 as newId } from "uuid";
import { addEdited, hasEdited, withDisabledAddEdited } from "./edited";
import { apiUrl } from "./myUrl";
import {
    decoderCurrentTasksApiResponse,
    decoderTaskPostApiRequest,
    decoderTaskPostApiResponse,
    decoderTasksAllLabelsApiResponse,
} from "../../api";
import { notificationError } from "../notifications";
import { PersonModel } from "./PersonModel";
import { DateTime } from "luxon";
import { optionalDateToString } from "../../domains/commonDbUtils";
import { Editable, ymeta } from "./ymeta";
import { mainModel, PersonModelLinkOpts, TaskModelLinkOpts } from "./MainModel";
//import { notifyChanges } from "./MainModel";

const REFRESH_CURRENT_TASKS_INTERVAL = 1000;
const REFRESH_TASK_ALL_LABELS_INTERVAL = 1000;

export class TaskModel implements Editable {
    // GRP_task_fields
    id: number = 0;
    uid: string = newId();
    @ymeta({ et: "string" }) name: string = "";
    @ymeta({ et: "enum", values: TaskTypeValues, defaultValue: "plain" }) type: TaskType = "plain";
    @ymeta({ et: "string", multiline: true }) description: string = "";
    @ymeta({ et: "date" }) reviewDate: DateTime | undefined;
    @ymeta({ et: "link", ...TaskModelLinkOpts }) parent: TaskModel | undefined;
    @ymeta({ et: "link", ...TaskModelLinkOpts }) result: TaskModel | undefined;
    @ymeta({ et: "link", ...PersonModelLinkOpts }) assignee: PersonModel | undefined;
    @ymeta({ et: "link", ...PersonModelLinkOpts }) reporter: PersonModel | undefined;
    @ymeta({ et: "boolean" }) isAcceptedByAssignee: boolean = false;
    @ymeta({ et: "boolean" }) isInProgress: boolean = false;
    @ymeta({ et: "boolean" }) isFinished: boolean = false;
    @ymeta({ et: "boolean" }) isWaiting: boolean = false;
    @ymeta({ et: "boolean" }) isAcceptedByManager: boolean = false;
    @ymeta({ et: "boolean" }) isAcceptedByReporter: boolean = false;
    @ymeta({ et: "boolean" }) isSucceded: boolean = false;
    @ymeta({ et: "labels", getAutocompleteItemsSync: getTaskAllLabels }) labels: string[] = [];
    @ymeta({ et: "duration" }) workDaysDuration: string | undefined;
    @ymeta({ et: "duration" }) calendarDaysDuration: string | undefined;
    @ymeta({ et: "duration" }) remainingEstimate: string | undefined;
    @ymeta({ et: "date" }) createdDate: DateTime | undefined;
    @ymeta({ et: "date" }) startDate: DateTime | undefined;
    @ymeta({ et: "date" }) endDate: DateTime | undefined;
    @ymeta({ et: "date" }) dueDate: DateTime | undefined;
    @ymeta({ et: "date" }) expectedStartDate: DateTime | undefined;
    @ymeta({ et: "date" }) expectedEndDate: DateTime | undefined;
    @ymeta({ et: "string" }) epicLink: string = "";
    @ymeta({ et: "string" }) jiraKey: string = "";
    @ymeta({ et: "enum", values: WaitTypeValues, defaultValue: "time" }) waitType: WaitType = "time";
    @ymeta({ et: "date" }) waitDate: DateTime | undefined;

    constructor() {
        const pthis = this;
    }

    getTitle() {
        return this.name;
    }

    setData(data: SerializedTask) {
        copyPrimitiveFields(this, data);
        // syncArray(this.items, data.items, () => new SurveyQuestionModel());
    }
}

export async function saveTasks(tasks: TaskModel[] | undefined) {
    if (!tasks?.length) return;

    const serializedTasks: any[] = [];
    for (let t of tasks) {
        const serializedTask: SerializedTask = {
            // GRP_task_fields
            stype: "task",
            id: t.id,
            uid: t.uid,
            name: t.name,
            type: t.type,
            description: t.description,
            reviewDate: optionalDateToString(t.reviewDate),

            parent: t.parent?.uid,
            result: t.result?.uid,
            assignee: t.assignee?.uid,
            reporter: t.reporter?.uid,
            isAcceptedByAssignee: t.isAcceptedByAssignee,
            isInProgress: t.isInProgress,
            isFinished: t.isFinished,
            isWaiting: t.isWaiting,
            isAcceptedByManager: t.isAcceptedByManager,
            isAcceptedByReporter: t.isAcceptedByReporter,
            isSucceded: t.isSucceded,
            labels: t.labels,
            workDaysDuration: t.workDaysDuration,
            calendarDaysDuration: t.calendarDaysDuration,
            remainingEstimate: t.remainingEstimate,
            createdDate: optionalDateToString(t.createdDate),
            startDate: optionalDateToString(t.startDate),
            endDate: optionalDateToString(t.endDate),
            dueDate: optionalDateToString(t.dueDate),
            expectedStartDate: optionalDateToString(t.expectedStartDate),
            expectedEndDate: optionalDateToString(t.expectedEndDate),
            epicLink: t.epicLink,
            jiraKey: t.jiraKey,
            waitType: t.waitType,
            waitDate: optionalDateToString(t.waitDate),
        };
        serializedTasks.push(serializedTask);
        console.log(`CODE00000303 Saving task summary=${t.name}, id=${t.id}, uid=${t.uid}`);
    }

    let readdEdited = true;
    try {
        const body = decoderTaskPostApiRequest.runWithException({ tasks: serializedTasks });
        const resp0 = await axios.post(apiUrl() + "/api/task", body);
        const { ok, error } = decoderTaskPostApiResponse.runWithException(resp0?.data);
        if (!ok) notificationError(`CODE00000289`, error || "unknown_error");
        else readdEdited = false;
    } catch (e) {
        notificationError(`CODE00000290`, e.message);
        console.error(`CODE00000203 ERROR in TaskModel.save ${e.message}`);
    }

    if (readdEdited) for (let item of tasks) addEdited(item, "name");
}
export async function refreshCurrentTasks() {
    if (!hasEdited())
        try {
            const resp0 = await axios.get(apiUrl() + "/api/tasks_current");
            const { tasks } = decoderCurrentTasksApiResponse.runWithException(resp0?.data);
            if (!hasEdited())
                withDisabledAddEdited(function () {
                    syncArray(mainModel.tasks.items, tasks, () => new TaskModel());
                });
        } catch (e) {
            console.error(`CODE00000293 ERROR in refreshCurrentTasks ${e.message}`);
        }
    if (REFRESH_CURRENT_TASKS_INTERVAL !== undefined) setTimeout(refreshCurrentTasks, REFRESH_CURRENT_TASKS_INTERVAL);
}
refreshCurrentTasks();

const allLabels: string[] = [];
export async function refreshTaskAllLabels() {
    try {
        const resp0 = await axios.get(apiUrl() + "/api/tasks_all_labels");
        const { labels } = decoderTasksAllLabelsApiResponse.runWithException(resp0?.data);
        allLabels.length = 0;
        allLabels.push(...labels);
    } catch (e) {
        console.error(`CODE00000200 ERROR in refreshTaskAllLabels ${e.message}`);
    }
    if (REFRESH_CURRENT_TASKS_INTERVAL !== undefined)
        setTimeout(refreshTaskAllLabels, REFRESH_TASK_ALL_LABELS_INTERVAL);
}
refreshTaskAllLabels();

export function getTaskAllLabels(): string[] {
    return allLabels;
}

if ((module as any).hot) {
    (module as any).hot.accept();
}
