import React, { useState } from "react";
import { useObserver } from "mobx-react-lite";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import Avatar from "@material-ui/core/Avatar";
import { Duration, DateTime } from "luxon";

import debugjs from "debug";
import { aggDuration } from "Ystd";
import { changer, setter } from "../../models/editFunctions";
import { EditableOpts } from "../../models/ymeta";

const debugRender = debugjs("render");

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        // textField: {
        //     //margin: ytheme.margin3,
        //     padding: "0px",
        // },
        avatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            fontSize: "0.6rem",
        },
    })
);

export function dateChanger(
    target: any,
    prop: string,
    eventOrValue: any,
    ymeta: EditableOpts,
    sign: "+" | "-",
    incValue: number,
    incComponent: keyof Duration
) {
    if (ymeta.et !== "date") {
        const error = new Error(`CODE00000119 Incompartible type: expected 'date' got '${ymeta.et}'.`);
        console.error(error);
        throw error;
    }
    const vv = target[prop] ? DateTime.fromISO(target[prop]) : DateTime.fromJSDate(new Date());

    const avv = vv.plus(Duration.fromObject({ [incComponent]: (sign === "+" ? 1 : -1) * incValue }));
    target[prop] = avv.toISO();
}

export const DateEditor: React.FC<{
    object: any;
    property: string;
    disabled?: boolean;
}> = ({ object, property, disabled, ...otherProps }) => {
    return useObserver(() => {
        debugRender("DateEditor");
        const [sign, setSign] = useState("+");
        const classes = useStyles();
        return (
            <div>
                <KeyboardDateTimePicker
                    label={property}
                    //                            value={DateTime.fromISO("2010-01-01")}
                    value={object[property] || null}
                    onChange={setter(object, property)}
                    onError={console.log}
                    ampm={false}
                    //                            format="yyyy-MM-dd HH:mm"
                    format="dd.MM.yyyy HH:mm"
                    disablePast
                    showTodayButton
                    disabled={disabled}
                    {...otherProps}
                />
                <IconButton onClick={changer(object, property, dateChanger, sign, 5, "minutes")}>
                    <Avatar className={classes.avatar}>{sign}5m</Avatar>
                </IconButton>
                <IconButton onClick={changer(object, property, dateChanger, sign, 1, "hours")}>
                    <Avatar className={classes.avatar}>{sign}1h</Avatar>
                </IconButton>
                <IconButton onClick={changer(object, property, dateChanger, sign, 1, "days")}>
                    <Avatar className={classes.avatar}>{sign}1d</Avatar>
                </IconButton>
            </div>
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
