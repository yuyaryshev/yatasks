import { OracleConnection0 } from "./OracleConnection0";
import { fjmap, mergeConditions, strNvlT } from "Ystd";

export interface GetTableMetaOpts {
    schemas?: string[];
    tables?: string[];
}

export interface OracleTableMeta {
    schema: string;
    name: string;
    tableSpace: string;
    pkName: string;
    columns: OracleColumnMeta[];
    columnsByName: { [key: string]: OracleColumnMeta };
    pkColumns: OracleColumnMeta[];

    columnsStr: string;
    columnsPkStr: string;
    columnsNonPkStr: string;
}

export interface OracleTablesMeta {
    tables: OracleTableMeta[];
    tablesObj: { [key: string]: { [key: string]: OracleTableMeta } };
}

export interface OracleColumnMeta {
    name: string;
    type: string;
    data_type: string;
    data_length: number;
    data_precision: number;
    data_scale: number;
    nullable: boolean;
    column_id: number;
}

export function fillOracleTableMeta(t: OracleTableMeta) {
    t.columnsStr = fjmap(t.columns, ", ", (c) => c.name);
    t.columnsPkStr = fjmap(t.pkColumns, ", ", (c) => c.name);
    t.columnsNonPkStr = fjmap(t.columns, ", ", (c) => (!t.pkColumns.includes(c) ? c.name : undefined));
}

export async function getTableMetas(db: OracleConnection0, opts: GetTableMetaOpts = {}): Promise<OracleTablesMeta> {
    let schemas = opts.schemas || [];
    let tablesWithSchema: { schema: string; table: string }[] = [];
    let tablesWithoutSchema: string[] = [];
    for (let t of opts.tables || []) {
        if (t.includes(".")) {
            const [schema, table] = t.split(".");
            tablesWithSchema.push({ schema, table });
        } else tablesWithoutSchema.push(t);
    }

    const tablesSql =
        `
    select 
        t.owner, 
        t.table_name, 
        t.tablespace_name,
        pk.constraint_name pk_name
    from all_tables t
    left join all_constraints pk
        on t.owner = pk.owner
        and t.table_name = pk.table_name
        and pk.constraint_type = 'P'
    ` +
        strNvlT`where ${mergeConditions(
            [
                strNvlT`t.owner in (${fjmap(schemas, ", ", (i) => `'${i}'`)})`,
                mergeConditions(
                    [
                        strNvlT`t.table_name in (${fjmap(tablesWithoutSchema, ", ", (i) => `'${i}'`)})`,
                        fjmap(
                            tablesWithSchema,
                            " or ",
                            (i) => `t.OWNER = '${i.schema}' and t.TABLE_NAME = '${i.table}'`
                        ),
                    ],
                    " or "
                ),
            ],
            " and "
        )}`;

    const actualTables: OracleTableMeta[] = [];
    const actualTablesObj: { [key: string]: { [key: string]: OracleTableMeta } } = {};

    for (let r of ((await db.execute(tablesSql))?.rows || []) as any) {
        const t: OracleTableMeta = {
            schema: r.OWNER,
            name: r.TABLE_NAME,
            tableSpace: r.TABLESPACE_NAME,
            pkName: r.PK_NAME,
            columns: [],
            columnsByName: {},
            pkColumns: [],
            columnsStr: "",
            columnsPkStr: "",
            columnsNonPkStr: "",
        };

        actualTables.push(t);
        if (!actualTablesObj[t.schema]) actualTablesObj[t.schema] = {};
        actualTablesObj[t.schema][t.name] = t;
    }

    const columnsSql = `
    select 
       c.owner
      ,c.table_name                                                    -- string
      ,c.column_name                                                   -- string
      ,c.data_type                                                     -- string
      ,c.data_length                                                  -- integer
      ,c.data_precision                                               -- integer
      ,c.data_scale                                                   -- integer
      ,c.nullable                                                      -- Y or N
      ,c.column_id                                                    -- integer
      ,pkc.position pk_position
  from (
    ${fjmap(
        actualTables,
        " union all\n    ",
        (i) => `select '${i.schema}' owner, '${i.name}' table_name, '${i.pkName}' pk_name from dual `
    )}
  ) t
  join all_tab_columns c
    on  c.owner = t.owner
    and c.table_name = t.table_name
  left join all_cons_columns pkc
    on  c.owner = pkc.owner
    and c.table_name = pkc.table_name
    and c.column_name = pkc.column_name
    and t.pk_name = pkc.constraint_name
  order by c.owner, c.table_name, c.column_id
`;

    for (let r of ((await db.execute(columnsSql))?.rows || []) as any) {
        const {
            OWNER,
            TABLE_NAME,
            COLUMN_NAME,
            DATA_TYPE,
            DATA_LENGTH,
            DATA_PRECISION,
            DATA_SCALE,
            NULLABLE,
            COLUMN_ID,
            PK_POSITION,
        } = r;
        const t = actualTablesObj[OWNER][TABLE_NAME];

        let type = DATA_TYPE;
        if (DATA_LENGTH !== null && type.includes("CHAR")) type += `(${DATA_LENGTH})`;

        const c: OracleColumnMeta = {
            name: COLUMN_NAME,
            type,
            data_type: DATA_TYPE,
            data_length: DATA_LENGTH,
            data_precision: DATA_PRECISION,
            data_scale: DATA_SCALE,
            nullable: NULLABLE === "Y",
            column_id: COLUMN_ID,
        };
        t.columnsByName[c.name] = c;
        t.columns.push(c);
        t.pkColumns[PK_POSITION - 1] = c;
    }

    for (let t of actualTables) fillOracleTableMeta(t);

    return {
        tables: actualTables,
        tablesObj: actualTablesObj,
    };
}

export function serializeOracleTablesMeta(m: OracleTablesMeta) {
    return m.tables.map((t) => {
        const { ...other } = t;
        return {
            ...other,
            pkColumns: t.pkColumns.map((c) => c.name),
        };
    });
}

export type SerializedOracleTablesMeta = ReturnType<typeof serializeOracleTablesMeta>;

export function deserializeOracleTablesMeta(s: SerializedOracleTablesMeta): OracleTablesMeta {
    const r: OracleTablesMeta = { tables: [], tablesObj: {} };
    for (let t of s) {
        const { pkColumns, ...other } = t;
        const tt: OracleTableMeta = {
            ...other,
            pkColumns: [],
            columnsByName: {},
        };
        for (let c of t.columns) tt.columnsByName[c.name] = c;

        for (let name of pkColumns) tt.pkColumns.push(tt.columnsByName[name]);

        if (!r.tablesObj[t.schema]) r.tablesObj[t.schema] = {};

        r.tablesObj[t.schema][t.name] = tt;
        r.tables.push(tt);

        for (let t of r.tables) fillOracleTableMeta(t);
    }
    return r;
}
