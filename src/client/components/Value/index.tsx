import React from "react";
import { useObserver } from "mobx-react-lite";

import debugjs from "debug";
import { Editable, getEditableMeta } from "../../models/ymeta";
import { ValueString } from "./ValueString";
import { ValueBoolean } from "./ValueBoolean";
import { ValueDate } from "./ValueDate";
import { ValueDuration } from "./ValueDuration";
import { ValueEnum } from "./ValueEnum";
import { ValueLabels } from "./ValueLabels";
import { ValueLink } from "./ValueLink";
import { ValueMultiLink } from "./ValueMultiLink";

const debugRender = debugjs("render");

export const Value: React.FC<{
    m: Editable;
    prop: string;
    editor?: boolean;
}> = ({ m, prop, ...otherProps }) => {
    return useObserver(() => {
        debugRender("Value");
        const ym = getEditableMeta(m, prop);

        // @ts-ignore
        if (!m) return <div>CODE00000116 No value supplied!</div>;
        if (!ym) return <div>CODE00000117 Provided value is not editable!</div>;

        // prettier-ignore
        switch (ym.et) {
            case "string":      return (<ValueString        m={m} prop={prop} {...otherProps} />);
            case "boolean":     return (<ValueBoolean       m={m} prop={prop} {...otherProps} />);
            case "date":        return (<ValueDate          m={m} prop={prop} {...otherProps} />);
            case "duration":    return (<ValueDuration      m={m} prop={prop} {...otherProps} />);
            case "enum":        return (<ValueEnum          m={m} prop={prop} {...otherProps} />);
            case "labels":      return (<ValueLabels        m={m} prop={prop} {...otherProps} />);
            case "link":        return (<ValueLink          m={m} prop={prop} {...otherProps} />);
            case "multilink":   return (<ValueMultiLink     m={m} prop={prop} {...otherProps} />);
            default: return (<div>CODE00000118 Unsupported ym.et='{(ym as any).et||"undefined"}'!</div>);
        }
    });
};

if ((module as any).hot) {
    (module as any).hot.accept();
}
