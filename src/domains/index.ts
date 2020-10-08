export * from "./task";
export * from "./person";

import { Table } from "./commonDbUtils";
import { taskTable } from "./task";
import { personTable } from "./person";

export const tables: Table[] = [taskTable, personTable];
