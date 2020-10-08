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

export const ValueEnum: React.FC<{
    m: any;
    prop: string;
    disabled?: boolean;
}> = ({ m, prop, disabled, ...otherProps }) => {
    return useObserver(() => {
        debugRender("ValueEnum");
        const ym = getEditableMeta(m, prop);
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
                        label={prop}
                        value={m[prop]}
                        onChange={setter(m, prop)}
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
