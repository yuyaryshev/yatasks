import { observable } from "mobx";
import { TaskListModel } from "./TaskListModel";
import { TaskModel } from "./TaskModel";
import { ActionAreaModel } from "./ActionAreaModel";
import { PersonListModel } from "./PersonListModel";
import { MessageBoxFunc, MessageBoxModel, registerMessageBox } from "../components/MessageBox";
import { getEditableMeta, ymeta } from "./ymeta";
import { PersonModel } from "./PersonModel";
import { apiUrl } from "./myUrl";
import axios from "axios";
import { decoderCurrentTasksApiResponse, SearchTaskApiRequest } from "../../api";
import { hasEdited, withDisabledAddEdited } from "./edited";
import { syncArray } from "./common";

setInterval(() => {
    mainModel.testField = "X aa489a XX " + new Date().toISOString().substr(17);
    //console.log(`CODE00000190 getEditableMeta(mainModel,"testField") = `, getEditableMeta(mainModel, "testField"));
}, 2000);

export const TaskModelLinkOpts = {
    getAutocompleteItemsSync: () => mainModel.tasks.items,
    getAutocompleteItemsAsync: async (q: string) => {
        try {
            const resp0 = await axios.get(apiUrl() + "/api/search", { params: { q } as SearchTaskApiRequest });
            const { tasks } = decoderCurrentTasksApiResponse.runWithException(resp0?.data);
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
