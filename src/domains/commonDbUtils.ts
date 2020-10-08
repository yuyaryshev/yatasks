import { Database } from "better-sqlite3";
import { DateTime } from "luxon";

export type ColumnType = "text" | "numeric" | "integer" | "date" | "boolean";

export interface Column {
    name: string;
    type: ColumnType;
}

export interface Table {
    name: string;
    columns: Column[];
    pk?: string[];
}

export const specialCols = {
    id: { create: "id integer primary key", replaceField: "id", replaceValue: ":id" },
    uid: { create: "uid text", replaceField: "uid", replaceValue: ":uid" },
} as any;

export const typesMapping = {
    boolean: { create: "numeric" },
} as any;

export function dropTable(db: Database, table: Table) {
    db.exec(`drop table if exists ${table.name}`);
}

export function createTable(db: Database, table: Table) {
    db.exec(
        `create table ${table.name}(${table.columns
            .map((c) => specialCols[c.name]?.create || `${c.name} ${typesMapping[c.type]?.create || c.type || ""}`)
            .join(",")})`
    );
}

export function prepareTableFuncs(db: Database, table: Table) {
    function makeSql(insert: boolean) {
        const sql = `${insert ? "insert" : "replace"} into ${table.name}(${table.columns
            .filter((c) => (insert ? c.name !== "id" : true))
            .map((c) => specialCols[c.name]?.replaceField || `${c.name}`)
            .filter((s) => s && s.length)
            .join(",")})
        values(${table.columns
            .filter((c) => (insert ? c.name !== "id" : true))
            .map((c) => specialCols[c.name]?.replaceValue || `:${c.name}`)
            .filter((s) => s && s.length)
            .join(",")})`;
        return sql;
    }

    const pthis = {
        emptyFieldsToNulls: function emptyFieldsToNullsFunction(v: any) {
            for (let c of table.columns) {
                if (v[c.name] === undefined) v[c.name] = null;
                else if (v[c.name] === false) v[c.name] = 0;
                else if (v[c.name] === true) v[c.name] = 1;
            }
        },
        insert: db.prepare(makeSql(true)),
        replace: db.prepare(makeSql(false)),
        save: function save(v: any) {
            try {
                pthis.emptyFieldsToNulls(v);
                if (v.id) pthis.replace.run(v);
                else pthis.insert.run(v);
            } catch (e) {
                console.error(
                    `CODE00000297 SQL Error ${e.message},\nsql=\n${
                        v.id ? pthis.replace.source : pthis.insert.source
                    }\n\n`
                );
                throw e;
            }
        },
    };
    return pthis;
}
export type TableFuncs = ReturnType<typeof prepareTableFuncs>;

export function serializeField(table: Table, o: any, f: string) {
    for (let c of table.columns)
        if (c.name === f) {
            switch (c.type) {
                case "boolean":
                    o[f] = o[f] ? 1 : 0;
                    break;
            }
        }
    throw new Error(`CODE00000209 Column ${f} not found!`);
}

export function deserializeField(table: Table, o: any, f: string) {
    if (o[f] === null) o[f] = undefined;
    for (let c of table.columns)
        if (c.name === f) {
            switch (c.type) {
                case "boolean":
                    o[f] = !!o[f];
                    break;
                case "date":
                    o[f] = o[f] || "";
                    break;
            }
            if (c.name === "labels") {
                // WA
                o[f] = (o[f] || "").split(" ");
            }
            return;
        }
    throw new Error(`CODE00000292 Column ${f} not found!`);
}

export function optionalDateToString(v: DateTime | Date | string | undefined) {
    let r: any = undefined;
    if (typeof v === "string") r = v.trim().length ? DateTime.fromISO(v).toISO() : undefined;
    else if (v instanceof Date) r = v ? DateTime.fromJSDate(v).toISO() : undefined;
    else if (v instanceof DateTime) r = v.toISO();
    if (r === null) debugger;
    return r;
}

export function isStringQuery(s: string) {
    s = s.toLowerCase().trim();
    return !s.includes("=") && !s.includes("<") && !s.includes(">") && !s.includes(" like ") && !s.includes(" ilike ");
}
