import React from "react";
import { useObserver } from "mobx-react-lite";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";

import debugjs from "debug";
import { setter } from "../../models/editFunctions";
import { TaskModel } from "../../models/TaskModel";

const debugRender = debugjs("render");

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            //margin: ytheme.margin3,
            padding: "0px",
        },
    })
);

export const TextEditor: React.FC<{
    object: any;
    property: string;
    disabled?: boolean;
}> = ({ object, property, disabled, ...otherProps }) => {
    return useObserver(() => {
        debugRender("ValueString");
        if (property === "name" && object instanceof TaskModel) {
            console.log(`CODE00000125 Rendering TaskModel.${property}`);
        }

        const classes = useStyles();
        return (
            <>
                <InputLabel>{property}</InputLabel>
                <Input
                    className={classes.textField}
                    value={object[property]}
                    onChange={setter(object, property)}
                    disabled={disabled}
                    {...otherProps}
                />
            </>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
