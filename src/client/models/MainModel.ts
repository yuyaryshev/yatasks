import { observable } from "mobx";
import { TaskListModel } from "./TaskListModel.js";
import { TaskModel } from "./TaskModel.js";
import { ActionAreaModel } from "./ActionAreaModel.js";
import { PersonListModel } from "./PersonListModel.js";
import { MessageBoxFunc, MessageBoxModel, registerMessageBox } from "../components/MessageBox.js";
import { getEditableMeta, ymeta } from "./ymeta.js";
import { PersonModel } from "./PersonModel.js";
import { apiUrl } from "./myUrl.js";
import axios from "axios";
import { decoderSearchApiRequest, decoderSearchApiResponse, SearchTaskApiRequest } from "../../api/index.js";
import { hasEdited, withDisabledAddEdited } from "./edited.js";
import { syncArray } from "./common.js";

setInterval(() => {
    mainModel.testField = "X aa489a XX " + new Date().toISOString().substr(17);
    //console.log(`CODE00000190 getEditableMeta(mainModel,"testField") = `, getEditableMeta(mainModel, "testField"));
}, 2000);

export const TaskModelLinkOpts = {
    getAutocompleteItemsSync: () => mainModel.tasks.items,
    getAutocompleteItemsAsync: async (q: string) => {
        try {
            const resp0 = await axios.get(apiUrl() + "/api/search", {
                params: decoderSearchApiRequest.runWithException({ q }),
            });
            const { tasks } = decoderSearchApiResponse.runWithException(resp0?.data);
            return tasks;
        } catch (e) {
            console.error(`CODE00000014 ERROR in refreshCurrentTasks ${e.message}`);
        }
        return [];
    },
    getTitle: (taskModel: TaskModel) => taskModel.name,
};
export const PersonModelLinkOpts = {
    getAutocompleteItemsSync: () => mainModel.persons.items,
    getTitle: (v: PersonModel) => v.name,
};

export class MainModel {
    @observable messageBoxModel: MessageBoxModel | undefined = undefined;
    messageBox: MessageBoxFunc;
    @observable instanceName = "???";
    @observable versionStr = "?.?.?";
    @observable haveChanges: boolean = false;
    @observable globalError?: string;
    @observable tasks: TaskListModel = new TaskListModel();
    @observable recentTasks: TaskListModel = new TaskListModel();
    @observable persons: PersonListModel = new PersonListModel();
    @observable maxRecentTasks: number = 20;

    @ymeta({ et: "link", ...TaskModelLinkOpts }) currentTask: TaskModel | undefined;
    @ymeta({ et: "string", defaultValue: "XXX2" }) testField: string = "XXX2";
    //    @observable testField: string = "XXX2";

    @observable drawerOpen: boolean = false;

    actionAreaModel: ActionAreaModel;
    toggleDrawer: () => void;

    createTask: () => TaskModel;
    addRecentTask: (task: TaskModel) => void;
    openTaskForm: (task: TaskModel) => void;
    constructor() {
        const pthis = this;
        this.messageBox = registerMessageBox(pthis);

        this.actionAreaModel = new ActionAreaModel(this);

        this.createTask = function createTask(open: boolean = true) {
            const task = new TaskModel();
            if (open) pthis.openTaskForm(task);
            return task;
        };

        this.openTaskForm = function openTaskForm(task: TaskModel) {
            pthis.addRecentTask(task);
            // TODO this.openTaskForm - открыть страницу редактирования Task
        };

        this.addRecentTask = function addRecentTask(task: TaskModel) {
            if (pthis.recentTasks.items[pthis.recentTasks.items.length - 1] === task) return;
            for (let i = 0; i < pthis.recentTasks.items.length; i++)
                if (pthis.recentTasks.items[i] === task) pthis.recentTasks.items.splice(i, 1);
            pthis.recentTasks.items.push(task);
            if (pthis.recentTasks.items.length > pthis.maxRecentTasks)
                pthis.recentTasks.items.splice(0, pthis.recentTasks.items.length - pthis.maxRecentTasks);
        };

        this.toggleDrawer = function toggleDrawer(v?: boolean) {
            pthis.drawerOpen = !pthis.drawerOpen;
        };
    }
}

export const mainModel = new MainModel();
(window as any).mainModel = mainModel;

if ((module as any).hot) {
    (module as any).hot.accept();
}
