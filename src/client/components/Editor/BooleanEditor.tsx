import React from "react";
import { useObserver } from "mobx-react-lite";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import debugjs from "debug";
import { setter, toggler } from "../../models/editFunctions.js";
import { Editable } from "../../models/ymeta.js";

const debugRender = debugjs("render");

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            //margin: ytheme.margin3,
            padding: "0px",
        },
    })
);

export const BooleanEditor: React.FC<{
    object: any;
    property: string;
    disabled?: boolean;
}> = ({ object, property, disabled, ...otherProps }) => {
    return useObserver(() => {
        debugRender("BooleanEditor");
        const classes = useStyles();
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        className={classes.textField}
                        checked={!!object[property]}
                        onChange={toggler(object, property)}
                        disabled={disabled}
                        {...otherProps}
                    />
                }
                label={property}
            />
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
