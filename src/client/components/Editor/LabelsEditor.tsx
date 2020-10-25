import React from "react";
import { useObserver } from "mobx-react-lite";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import debugjs from "debug";
import { setter } from "../../models/editFunctions";
import { getEditableMeta } from "../../models/ymeta";

const debugRender = debugjs("render");

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            //margin: ytheme.margin3,
            padding: "0px",
        },
    })
);

export const LabelsEditor: React.FC<{
    object: any;
    property: string;
    disabled?: boolean;
}> = ({ object, property, disabled, ...otherProps }) => {
    return useObserver(() => {
        debugRender("LabelsEditor");
        const ym = getEditableMeta(object, property);
        if (!ym || ym.et !== "labels")
            return <div>CODE00000122 Unsupported ym.et='{(ym as any).et || "undefined"}'!</div>;

        const classes = useStyles();
        return (
            <Autocomplete
                multiple
                id="size-small-standard-multi"
                size="small"
                options={ym.getAutocompleteItemsSync()}
                getOptionLabel={(option) => option}
                value={object[property]}
                onChange={setter(object, property)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        className={classes.textField}
                        label={property}
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
