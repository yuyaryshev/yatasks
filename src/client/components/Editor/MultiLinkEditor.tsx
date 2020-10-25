import React, { useMemo, useState } from "react";
import { useObserver } from "mobx-react-lite";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";

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

export const MultiLinkEditor: React.FC<{
    object: any;
    property: string;
    disabled?: boolean;
    searchTimeout?: number;
}> = ({ object, property, disabled, searchTimeout, ...otherProps }) => {
    const [searchTimeoutHandle, setSearchTimeoutHandle] = useState(0 as any);
    const [searchQuery, setSearchQuery] = useState("");
    const [asyncAutocompleteItems, setAsyncAutocompleteItems] = useState([] as any[]);
    function onSearchQueryChanged(v: any) {
        setSearchQuery(v);
        setAsyncAutocompleteItems([]);
        if (searchTimeoutHandle) clearTimeout(searchTimeoutHandle);
        setSearchTimeoutHandle(
            setTimeout(async function executeSearchQuery() {
                try {
                    const ym = getEditableMeta(object, property);
                    if (ym && ym.et === "link" && ym.getAutocompleteItemsAsync)
                        setAsyncAutocompleteItems(await ym.getAutocompleteItemsAsync(searchQuery));
                } catch (e) {
                    console.error(`CODE00000012 Failed to load ValueLink values`, e);
                }
            }, searchTimeout || 1000)
        );
    }

    return useObserver(() => {
        debugRender("MultiLinkEditor");
        const ym = getEditableMeta(object, property);
        if (!ym || ym.et !== "multilink")
            return <div>CODE00000124 Unsupported ym.et='{(ym as any).et || "undefined"}'!</div>;

        const allAutocompleteItems = useMemo(() => {
            return [...(ym.getAutocompleteItemsSync ? ym.getAutocompleteItemsSync() : []), ...asyncAutocompleteItems];
        }, [asyncAutocompleteItems]);

        const classes = useStyles();
        return (
            <Autocomplete
                multiple
                size="small"
                options={allAutocompleteItems}
                onInputChange={onSearchQueryChanged}
                getOptionLabel={ym.getTitle}
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
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip variant="outlined" label={ym.getTitle} size="small" {...getTagProps({ index })} />
                    ))
                }
            />
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
