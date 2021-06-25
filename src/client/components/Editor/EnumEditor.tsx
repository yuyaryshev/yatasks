import React from "react";
import { useObserver } from "mobx-react-lite";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import debugjs from "debug";
import { setter } from "../../models/editFunctions.js";
import { getEditableMeta } from "../../models/ymeta.js";

const debugRender = debugjs("render");

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            //margin: ytheme.margin3,
            padding: "0px",
        },
    })
);

export const EnumEditor: React.FC<{
    object: any;
    property: string;
    disabled?: boolean;
}> = ({ object, property, disabled, ...otherProps }) => {
    return useObserver(() => {
        debugRender("EnumEditor");
        const ym = getEditableMeta(object, property);
        if (!ym || ym.et !== "enum")
            return <div>CODE00000121 Unsupported ym.et='{(ym as any).et || "undefined"}'!</div>;

        const classes = useStyles();
        return (
            <Autocomplete
                id="combo-box-demo"
                options={ym.values}
                getOptionLabel={(option: string) => option}
                style={{ width: 300 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        className={classes.textField}
                        label={property}
                        value={object[property]}
                        onChange={setter(object, property)}
                        disabled={disabled}
                        {...otherProps}
                    />
                )}
            />
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
