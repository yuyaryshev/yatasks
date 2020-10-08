import React, { useContext } from "react";

export type ValueRenderMode = "form" | "tableCell" | "text" | "textInlineEditor";
export type ValueContextT = ValueRenderMode;

const ValueContext = React.createContext("form" as ValueRenderMode);

export function useValueContainerContext(): ValueContextT {
    return useContext(ValueContext);
}

export function ValueContainer(props: { mode: ValueRenderMode; children: any }) {
    return <ValueContext.Provider value={props.mode}>{props.children}</ValueContext.Provider>;
}

// implementing Value: const valueContext = useValueContainerContext()
// <ValueContainer mode="form">....</ValueContainer>
