import axios from "axios";
import { PersonType, PersonTypeValues, SerializedPerson } from "../../domains/index.js";
import { copyPrimitiveFields, syncArray } from "./common.js";
import { v4 as newId } from "uuid";
import { addEdited, hasEdited, withDisabledAddEdited } from "./edited.js";
import { apiUrl } from "./myUrl.js";
import { decoderCurrentPersonsApiResponse, decoderPersonPostApiRequest, decoderPersonPostApiResponse } from "../../api/index.js";
import { notificationError } from "../notifications.js";
//import { notifyChanges } from "./MainModel";
import { Editable, ymeta } from "./ymeta.js";
import { mainModel } from "./MainModel.js";

const REFRESH_CURRENT_PERSONS_INTERVAL = undefined; // 999999 * 60 * 60 * 1000;

export class PersonModel implements Editable {
    // GRP_person_fields
    id: number = 0;
    uid: string = newId();
    @ymeta({ et: "string" }) name: string = "";
    @ymeta({ et: "enum", values: PersonTypeValues, defaultValue: "other" }) type: PersonType | undefined;
    @ymeta({ et: "string", multiline: true }) description: string = "";

    constructor() {
        const pthis = this;
    }

    getTitle() {
        return this.name;
    }

    setData(data: SerializedPerson) {
        copyPrimitiveFields(this, data);
        // syncArray(this.items, data.items, () => new SurveyQuestionModel());
    }
}

export async function refreshCurrentPersons() {
    if (!hasEdited())
        try {
            const resp0 = await axios.get(apiUrl() + "/api/persons_current");
            const { persons } = decoderCurrentPersonsApiResponse.runWithException(resp0?.data);
            if (!hasEdited())
                withDisabledAddEdited(function () {
                    syncArray(mainModel.persons.items, persons, () => new PersonModel());
                });
        } catch (e) {
            console.error(`CODE00000309 ERROR in PersonModel_reloadValues ${e.message}`);
        }
    if (REFRESH_CURRENT_PERSONS_INTERVAL !== undefined)
        setTimeout(refreshCurrentPersons, REFRESH_CURRENT_PERSONS_INTERVAL);
}
refreshCurrentPersons();

export async function savePersons(persons: PersonModel[] | undefined) {
    if (!persons?.length) return;

    const serializedPersons: any[] = [];
    for (let t of persons) {
        const serializedPerson = {
            // GRP_person_fields
            stype: "person",
            id: t.id,
            uid: t.uid,
            name: t.name,
            type: t.type,
            description: t.description,
        };
        serializedPersons.push(serializedPerson);
    }

    let readdEdited = true;
    try {
        const body = decoderPersonPostApiRequest.runWithException({ persons: serializedPersons });
        const resp0 = await axios.post(apiUrl() + "/api/person", body);
        const { ok, error } = decoderPersonPostApiResponse.runWithException(resp0?.data);
        if (!ok) notificationError(`CODE00000191`, error || "unknown_error");
        else readdEdited = false;
    } catch (e) {
        notificationError(`CODE00000192`, e.message);
        console.error(`CODE00000100 ERROR in PersonModel.save ${e.message}`);
    }

    if (readdEdited) for (let item of persons) addEdited(item, "name");
}

if ((module as any).hot) {
    (module as any).hot.accept();
}
