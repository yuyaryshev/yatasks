import React, { useState } from "react";
import { useObserver } from "mobx-react-lite";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Avatar from "@material-ui/core/Avatar";
import { Duration } from "luxon";

import debugjs from "debug";
import { aggDuration, durationObjToEngStr } from "Ystd";
import { changer, setter } from "../../models/editFunctions";
import { EditableOpts } from "../../models/ymeta";

const debugRender = debugjs("render");

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            //margin: ytheme.margin3,
            padding: "0px",
        },
        avatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            fontSize: "0.6rem",
        },
    })
);

export function durationChanger(
    target: any,
    prop: string,
    eventOrValue: any,
    ymeta: EditableOpts,
    sign: "+" | "-",
    incValue: number,
    incComponent: keyof Duration
) {
    if (ymeta.et !== "duration") {
        const error = new Error(`CODE00000120 Incompartible type: expected 'duration' got '${ymeta.et}'.`);
        console.error(error);
        throw error;
    }
    const vv = Duration.fromISO(target[prop] || "PT0S");
    const vv2 = vv.plus(Duration.fromObject({ [incComponent]: (sign === "+" ? 1 : -1) * incValue }));
    const avv = Duration.fromObject(aggDuration(vv2));
    target[prop] = avv.toISO();
}

export const DurationEditor: React.FC<{
    object: any;
    property: string;
    disabled?: boolean;
}> = ({ object, property, disabled, ...otherProps }) => {
    return useObserver(() => {
        debugRender("ValueDuration");
        const [sign, setSign] = useState("+");
        const classes = useStyles();
        return (
            <>
                <InputLabel>{property}</InputLabel>
                <Input
                    className={classes.textField}
                    value={object[property] ? durationObjToEngStr(Duration.fromISO(object[property])) : ""}
                    onChange={setter(object, property)}
                    disabled={disabled}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={changer(object, property, durationChanger, sign, 5, "minutes")}>
                                <Avatar className={classes.avatar}>{sign}5m</Avatar>
                            </IconButton>
                            <IconButton onClick={changer(object, property, durationChanger, sign, 1, "hours")}>
                                <Avatar className={classes.avatar}>{sign}1h</Avatar>
                            </IconButton>
                            <IconButton onClick={changer(object, property, durationChanger, sign, 1, "days")}>
                                <Avatar className={classes.avatar}>{sign}1d</Avatar>
                            </IconButton>
                        </InputAdornment>
                    }
                    {...otherProps}
                />
            </>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
