import React, { useState, useMemo } from "react";
import { useObserver } from "mobx-react-lite";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

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

export const LinkEditor: React.FC<{
    object: any;
    property: string;
    disabled?: boolean;
    searchTimeout?: number;
}> = ({ object, property, disabled, searchTimeout, ...otherProps }) => {
    const ym = getEditableMeta(object, property);
    const [searchTimeoutHandle, setSearchTimeoutHandle] = useState(0 as any);
    // const [searchQuery, setSearchQuery] = useState("");
    const [asyncAutocompleteItems, setAsyncAutocompleteItems] = useState([] as any[]);
    function onSearchQueryChanged(v: any) {
        const searchQueryV = v.target.value;
        // setSearchQuery(searchQueryV);
        setAsyncAutocompleteItems([]);
        if (searchTimeoutHandle) clearTimeout(searchTimeoutHandle);
        setSearchTimeoutHandle(
            setTimeout(async function executeSearchQuery() {
                try {
                    console.log(`CODE00000009 STARTED ASYNC QUERY ${searchQueryV}`);
                    if (ym && ym.et === "link" && ym.getAutocompleteItemsAsync)
                        setAsyncAutocompleteItems(await ym.getAutocompleteItemsAsync(searchQueryV));
                    console.log(`CODE00000010 FINISHED ASYNC QUERY ${searchQueryV}`);
                    setSearchTimeoutHandle(0 as any);
                } catch (e) {
                    console.error(`CODE00000011 Failed to load ValueLink values`, e);
                }
            }, searchTimeout || 1000)
        );
    }

    const loading = !!(searchTimeoutHandle && ym && ym.et === "link" && ym.getAutocompleteItemsAsync);

    return useObserver(() => {
        debugRender("LinkEditor");
        const ym = getEditableMeta(object, property);
        if (!ym || ym.et !== "link")
            return <div>CODE00000123 Unsupported ym.et='{(ym as any).et || "undefined"}'!</div>;

        const allAutocompleteItems = useMemo(() => {
            return [...(ym.getAutocompleteItemsSync ? ym.getAutocompleteItemsSync() : []), ...asyncAutocompleteItems];
        }, [asyncAutocompleteItems]);

        const classes = useStyles();
        return (
            <Autocomplete
                size="small"
                options={allAutocompleteItems}
                getOptionLabel={ym.getTitle}
                value={object[property]}
                onInputChange={onSearchQueryChanged}
                onChange={setter(object, property)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        className={classes.textField}
                        label={property}
                        disabled={disabled}
                        {...otherProps}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        );
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
