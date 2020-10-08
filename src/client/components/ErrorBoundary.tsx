import React from "react";

export interface ErrorBoundaryProps {}
interface ErrorBoundaryState {
    hasError?: boolean;
    errorText?: string;
    errorStack?: string;
}

export class ErrorBoundary extends React.PureComponent<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error, info: any) {
        // Display fallback UI
        this.setState({ hasError: true, errorText: error.message, errorStack: error.stack });
        // You can also log the error to an error reporting service
        console.log("ErrorBoundary", error);
        //logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h1>Render Error</h1>
                    <p>
                        <b>{this.state.errorText}</b>
                    </p>
                    {this.state.errorStack?.split("\n").map((s) => (
                        <p>{s}</p>
                    ))}
                </div>
            );
        }
        return this.props.children;
    }
}

if ((module as any).hot) {
    (module as any).hot.accept();
}
