import React from "react";
import { useObserver } from "mobx-react-lite";

import debugjs from "debug";
import { Editable, getEditableMeta } from "../../models/ymeta.js";
import { TextEditor } from "./TextEditor.js";
import { BooleanEditor } from "./BooleanEditor.js";
import { DateEditor } from "./DateEditor.js";
import { DurationEditor } from "./DurationEditor.js";
import { EnumEditor } from "./EnumEditor.js";
import { LabelsEditor } from "./LabelsEditor.js";
import { LinkEditor } from "./LinkEditor.js";
import { MultiLinkEditor } from "./MultiLinkEditor.js";

const debugRender = debugjs("render");

export const Editor: React.FC<{
    object: Editable;
    property: string;
    editor?: boolean;
}> = ({ object, property, ...otherProps }) => {
    return useObserver(() => {
        debugRender("Value");
        const ym = getEditableMeta(object, property);

        // @ts-ignore
        if (!object) return <div>CODE00000116 No value supplied!</div>;
        if (!ym) return <div>CODE00000117 Provided value is not editable!</div>;

        // prettier-ignore
        switch (ym.et) {
            case "string":      return (<TextEditor object={object} property={property} {...otherProps} />);
            case "boolean":     return (<BooleanEditor object={object} property={property} {...otherProps} />);
            case "date":        return (<DateEditor object={object} property={property} {...otherProps} />);
            case "duration":    return (<DurationEditor object={object} property={property} {...otherProps} />);
            case "enum":        return (<EnumEditor object={object} property={property} {...otherProps} />);
            case "labels":      return (<LabelsEditor object={object} property={property} {...otherProps} />);
            case "link":        return (<LinkEditor object={object} property={property} {...otherProps} />);
            case "multilink":   return (<MultiLinkEditor object={object} property={property} {...otherProps} />);
            default: return (<div>CODE00000118 Unsupported ym.et='{(ym as any).et||"undefined"}'!</div>);
        }
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
