import { observable } from "mobx";
import { TaskModel } from "./TaskModel.js";

//import { notifyChanges } from "./MainModel";

export class TaskListModel {
    @observable items: TaskModel[] = [];
    @observable canCreate: boolean = false;

    create: () => void;

    constructor() {
        const pthis = this;

        this.create = () => {
            // TODO create new TaskModel
        };
    }

    setData(data: TaskModel[]) {
        // TODO TaskListModel.setData
        // copyPrimitiveFields(this, data);
    }
}

if ((module as any).hot) {
    (module as any).hot.accept();
}
