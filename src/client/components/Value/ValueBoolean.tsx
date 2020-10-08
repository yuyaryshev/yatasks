import React from "react";
import { useObserver } from "mobx-react-lite";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import debugjs from "debug";
import { setter, toggler } from "../../models/editFunctions";
import { Editable } from "../../models/ymeta";

const debugRender = debugjs("render");

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            //margin: ytheme.margin3,
            padding: "0px",
        },
    })
);

export const ValueBoolean: React.FC<{
    m: any;
    prop: string;
    disabled?: boolean;
}> = ({ m, prop, disabled, ...otherProps }) => {
    return useObserver(() => {
        debugRender("ValueBoolean");
        const classes = useStyles();
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        className={classes.textField}
                        checked={!!m[prop]}
                        onChange={toggler(m, prop)}
                        disabled={disabled}
                        {...otherProps}
                    />
                }
                label={prop}
            />
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
