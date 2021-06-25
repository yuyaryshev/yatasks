export * from "./task.js";
export * from "./person.js";

import { Table } from "./commonDbUtils.js";
import { taskTable } from "./task.js";
import { personTable } from "./person.js";

export const tables: Table[] = [taskTable, personTable];
