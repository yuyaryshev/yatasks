import { notificationSetup } from "./notifications";
import React from "react";
import { render } from "react-dom";
import { Main as Main0 } from "./components/main";
import { mainModel, MainModel } from "./models";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useObserver } from "mobx-react-lite";

import { apiUrl } from "./models/myUrl";
import { ytheme } from "./components/ytheme";
import { addSendChangesHandler, EditedObjects } from "./models/edited";
import { saveTasks, TaskModel } from "./models/TaskModel";
import { PersonModel, savePersons } from "./models/PersonModel";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import LuxonUtils from "@date-io/luxon";
import { startClientTemp } from "./clientTemp";

const useHotReloading = process.env.hot;

let Main = useHotReloading ? Main0 : Main0;

const UIMain: React.FC<{ mainModel: MainModel }> = ({ mainModel }) => {
    const { enqueueSnackbar } = useSnackbar();
    notificationSetup(useSnackbar());
    return useObserver(() => <Main m={mainModel} />);
};

const MyApp: React.FC<{ mainModel: MainModel }> = ({ mainModel }) => {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            // @ts-ignore
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <div style={{ backgroundColor: ytheme.backgroundColor }}>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            <SnackbarProvider maxSnack={3}>
                <MuiPickersUtilsProvider utils={LuxonUtils}>
                    <UIMain mainModel={mainModel} />
                </MuiPickersUtilsProvider>
            </SnackbarProvider>
        </div>
    );
};

(async () => {
    try {
        console.log(`Use localStorage.debug = '...' to change debug output!`);
        document.body.style.backgroundColor = ytheme.backgroundColor;
        let root = document.querySelector("#root");
        if (!root) {
            root = document.createElement("div");
            root.id = "root";
            document.body.appendChild(root);
        }

        console.log(`Starting...`);
        console.log(`Base URL = '${apiUrl()}'`);
        console.log(`mainModel = `, mainModel);
        render(<MyApp mainModel={mainModel} />, root);
        document.body.removeChild(document.querySelector("#unsupported_message")!);
    } catch (e) {}
    startClientTemp();
    // loadSurvey(surveyIdFromUrl());
    function sendChanges(editedObjects: EditedObjects) {
        const editedObjectsArray = [...editedObjects.keys()];
        saveTasks(editedObjectsArray.filter((o) => o instanceof TaskModel));
        savePersons(editedObjectsArray.filter((o) => o instanceof PersonModel));
    }
    addSendChangesHandler(sendChanges);
})();

if ((module as any).hot) {
    (module as any).hot.accept();
}
