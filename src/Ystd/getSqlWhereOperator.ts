export function getSqlWhereOperator(mode: string) {
    switch (mode) {
        case "like": {
            return "like";
        }
        case "in": {
            return "in";
        }
        case "equal": {
            return "=";
        }
        case "null": {
            return "is null";
        }
        case "more": {
            return ">";
        }
        case "less": {
            return "<";
        }
        case "moreeq": {
            return ">=";
        }
        case "lesseq": {
            return "<=";
        }
        default: {
            throw new Error(`CODE0000000 filter type '${mode}' not found`);
        }
    }
}
