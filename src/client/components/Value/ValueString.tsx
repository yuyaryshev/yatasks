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

export const ValueString: React.FC<{
    m: any;
    prop: string;
    disabled?: boolean;
}> = ({ m, prop, disabled, ...otherProps }) => {
    return useObserver(() => {
        debugRender("ValueString");
        if (prop === "name" && m instanceof TaskModel) {
            console.log(`CODE00000125 Rendering TaskModel.${prop}`);
        }

        const classes = useStyles();
        return (
            <>
                <InputLabel>{prop}</InputLabel>
                <Input
                    className={classes.textField}
                    value={m[prop]}
                    onChange={setter(m, prop)}
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
