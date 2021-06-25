import { observable } from "mobx";
import { PersonModel } from "./PersonModel.js";

//import { notifyChanges } from "./MainModel";

export class PersonListModel {
    @observable items: PersonModel[] = [];
    @observable canCreate: boolean = false;

    create: () => void;

    constructor() {
        const pthis = this;

        this.create = () => {
            // TODO create new PersonModel
        };
    }

    setData(data: PersonModel[]) {
        // TODO PersonListModel.setData
        // copyPrimitiveFields(this, data);
    }
}

if ((module as any).hot) {
    (module as any).hot.accept();
}
