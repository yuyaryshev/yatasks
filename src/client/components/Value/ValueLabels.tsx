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

export const ValueLabels: React.FC<{
    m: any;
    prop: string;
    disabled?: boolean;
}> = ({ m, prop, disabled, ...otherProps }) => {
    return useObserver(() => {
        debugRender("ValueLabels");
        const ym = getEditableMeta(m, prop);
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
                value={m[prop]}
                onChange={setter(m, prop)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        className={classes.textField}
                        label={prop}
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
