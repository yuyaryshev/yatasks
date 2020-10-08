import { TaskModel } from "./models/TaskModel";
import { mainModel } from "./models";

export function startClientTemp() {
    setTimeout(function doClientTemp() {
        for (let i = 1; i < 5; i++) {
            let t = new TaskModel();
            t.name = `Task${i}`;
            t.description = `Task${i}.description`;
            // (window as any).t = t;
            console.log(`CODE00000288 t.name = `, t.name);
            mainModel.tasks.items.push(t);
            console.log(`CODE00000280 t.name = `, t.name);
        }
    }, 0);
}
