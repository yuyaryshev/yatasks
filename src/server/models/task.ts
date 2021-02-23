import { PartialSerializedTask, rowToSerializedTask, SerializedTask, taskTable } from "../../domains";
import { Database, Statement } from "better-sqlite3";
import { Env } from "../startApiServer";
import { createTable, dropTable, isStringQuery, prepareTableFuncs, TableFuncs } from "../../domains/commonDbUtils";

// export const decoderSurveyRepository: Decoder<SurveyRepository> = object({
//     surveys: dict(decoderSurvey),
// });

export class TaskServerModel {
    db: Database;
    getTaskByIdSql: Statement<[number]>;
    getTaskByUidSql: Statement<[string]>;
    tableFuncs: TableFuncs;
    constructor(env: Env) {
        this.db = env.db;

        dropTable(this.db, taskTable);
        createTable(this.db, taskTable);

        for (
            let i = 1;
            i < 4;
            i++ // GRP_task_fields
        )
            this.db.exec(
                `insert into task (uid, type, name, description, reviewDate) values('t${i}id', 'plain','task${i}srv','task${i}srv.description','2020-09-2${i}')`
            );

        for (
            let i = 5;
            i < 9;
            i++ // GRP_task_fields
        )
            this.db.exec(
                `insert into task (uid, type, name, description, reviewDate, endDate) values('t${i}id', 'plain','ended task${i}srv','ended task${i}srv.description','2020-09-2${i}','2010-01-0${i}')`
            );

        this.getTaskByIdSql = this.db.prepare(`select * from task where id = ?`);
        this.getTaskByUidSql = this.db.prepare(`select * from task where uid = ?`);
        this.tableFuncs = prepareTableFuncs(this.db, taskTable);
    }

    searchTasks(query0: string): SerializedTask[] {
        const query = isStringQuery(query0)
            ? `upper(name) like '%${query0.toUpperCase().split(" ").join("%")}%'`
            : query0;
        const sql = `select * from task where ${query}`;
        try {
            return this.db.prepare(sql).all().map(rowToSerializedTask);
        } catch (e) {
            console.error(`CODE00000187 SQL Error ${e.message},\nsql=\n${sql}\n\n`);
            throw e;
        }
    }

    currentTasks(): SerializedTask[] {
        const sql = `select * from task where (endDate is null or endDate > datetime('now','-1 hours','localtime'))`;
        try {
            return this.db.prepare(sql).all().map(rowToSerializedTask);
        } catch (e) {
            console.error(`CODE00000097 SQL Error ${e.message},\nsql=\n${sql}\n\n`);
            throw e;
        }
    }

    tasksAllLabels(): string[] {
        const sql = `select distinct labels from task where labels is not null and length(labels)>1`;
        try {
            const labelsSet: Set<string> = new Set<string>();
            const lines = this.db.prepare(sql).all();
            for (let line of lines) labelsSet.add(line.split(" ").map((s: string) => s.trim()));
            return [...labelsSet];
        } catch (e) {
            console.error(`CODE00000098 SQL Error ${e.message},\nsql=\n${sql}\n\n`);
            throw e;
        }
    }

    getTask(id: number, uid: string): SerializedTask | undefined {
        try {
            return id
                ? this.getTaskByIdSql.all(id).map(rowToSerializedTask)[0]
                : this.getTaskByUidSql.all(uid).map(rowToSerializedTask)[0];
        } catch (e) {
            console.error(`CODE00000189 SQL Error ${e.message},\nsql=\n${this.getTaskByIdSql.source}\n\n`);
            throw e;
        }
    }

    applyChange(task: PartialSerializedTask) {
        const oldTask = this.getTask(task.id, task.uid);
        const newTask = Object.assign(oldTask || {}, task);
        // GRP_task_fields
        if (!newTask.name) newTask.name = "";
        if (!newTask.type) newTask.type = "plain";
        if (!newTask.description) newTask.description = "";
        if (!newTask.reviewDate) newTask.reviewDate = undefined;
        if (!newTask.createdDate) newTask.createdDate = new Date().toISOString();
        if (!newTask.isAcceptedByAssignee) newTask.isAcceptedByAssignee = false;
        if (!newTask.isAcceptedByManager) newTask.isAcceptedByManager = false;
        if (!newTask.isAcceptedByReporter) newTask.isAcceptedByReporter = false;
        if (!newTask.isFinished) newTask.isFinished = false;
        if (!newTask.isInProgress) newTask.isInProgress = false;
        if (!newTask.isSucceded) newTask.isSucceded = false;
        if (!newTask.isWaiting) newTask.isWaiting = false;
        if (!newTask.assignee) newTask.assignee = undefined;
        if (!newTask.reporter) newTask.reporter = undefined;
        if (!newTask.parent) newTask.parent = undefined;
        if (!newTask.result) newTask.result = undefined;
        if (!newTask.testlink) newTask.testlink = undefined;
        newTask.labels = (newTask.labels || []).join(" ") as any;
        this.saveTask(newTask as any);
    }

    saveTask(task: SerializedTask) {
        return this.tableFuncs.save(task);
    }

    calculatePlan() {
        // TODO Функция calculatePlan - расчет плана задач
    }

    getPlan() {
        // TODO Функция getPlan - данные для отображения плана работ в календарной форме
    }
}
