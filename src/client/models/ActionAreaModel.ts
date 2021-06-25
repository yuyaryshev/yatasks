import { saveTasks } from "./TaskModel.js";
import { MainModel } from "./MainModel.js";
import { notificationSuccess } from "../notifications.js";
import { ymeta } from "./ymeta.js";
import { clearProp } from "./editFunctions.js";

export class ActionAreaModel {
    @ymeta({ et: "string" }) newTaskText: string = "";
    onNewTaskTextKeyDown: (event: any) => void;
    constructor(public readonly mainModel: MainModel) {
        const pthis = this;
        this.onNewTaskTextKeyDown = function onNewTaskTextKeyDown(event: KeyboardEvent) {
            const anyModifier = event.ctrlKey || event.shiftKey || event.altKey;
            console.log(`onNewTaskTextKeyDown`);
            if (event.key === "Enter" && anyModifier) {
                console.log(`onNewTaskTextKeyDown-2`);
                if (pthis.newTaskText.trim().length > 0) {
                    const taskModel = pthis.mainModel.createTask();
                    taskModel.name = pthis.newTaskText;
                    (async () => {
                        saveTasks([taskModel]);
                        notificationSuccess(`CODE00000208`, `Задача сохранена!`);
                    })();
                }
                clearProp(pthis, "newTaskText");
            }
        };
    }
}
