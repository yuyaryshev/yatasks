import { PartialSerializedPerson, personTable, rowToSerializedPerson, SerializedPerson } from "../../domains/index.js";
import { Database, Statement } from "better-sqlite3";
import { Env } from "../startApiServer.js";
import { createTable, dropTable, isStringQuery, prepareTableFuncs, TableFuncs } from "../../domains/commonDbUtils.js";

// export const decoderSurveyRepository: Decoder<SurveyRepository> = object({
//     surveys: dict(decoderSurvey),
// });

export class PersonServerModel {
    db: Database;
    getPersonByIdSql: Statement<[number]>;
    getPersonByUidSql: Statement<[string]>;
    tableFuncs: TableFuncs;
    constructor(env: Env) {
        this.db = env.db;

        dropTable(this.db, personTable);
        createTable(this.db, personTable);

        for (
            let i = 1;
            i < 4;
            i++ // GRP_person_fields
        )
            this.db.exec(
                `insert into person (uid, type, name, description, reviewDate) values('t${i}id', 'team','person${i}srv','person${i}srv.description','2020-09-2${i}')`
            );

        this.getPersonByIdSql = this.db.prepare(`select * from person where id = ?`);
        this.getPersonByUidSql = this.db.prepare(`select * from person where uid = ?`);
        this.tableFuncs = prepareTableFuncs(this.db, personTable);
    }

    searchPersons(query0: string): SerializedPerson[] {
        const query = isStringQuery(query0)
            ? `upper(name) like '%${query0.toUpperCase().split(" ").join("%")}%'`
            : query0;
        const sql = `select * from person where ${query}`;
        try {
            return this.db.prepare(sql).all().map(rowToSerializedPerson);
        } catch (e) {
            console.error(`CODE00000105 SQL Error ${e.message},\nsql=\n${sql}\n\n`);
            throw e;
        }
    }

    currentPersons(): SerializedPerson[] {
        const sql = `select * from person where 1=1`;
        try {
            return this.db.prepare(sql).all().map(rowToSerializedPerson);
        } catch (e) {
            console.error(`CODE00000106 SQL Error ${e.message},\nsql=\n${sql}\n\n`);
            throw e;
        }
    }

    getPerson(id: number, uid: string): SerializedPerson | undefined {
        try {
            return id
                ? this.getPersonByIdSql.all(id).map(rowToSerializedPerson)[0]
                : this.getPersonByUidSql.all(uid).map(rowToSerializedPerson)[0];
        } catch (e) {
            console.error(`CODE00000107 SQL Error ${e.message},\nsql=\n${this.getPersonByIdSql.source}\n\n`);
            throw e;
        }
    }

    applyChange(person: PartialSerializedPerson) {
        const oldPerson = this.getPerson(person.id, person.uid);
        const newPerson = Object.assign(oldPerson || {}, person);
        // GRP_person_fields
        if (!newPerson.name) newPerson.name = "";
        if (!newPerson.type) newPerson.type = "other";
        if (!newPerson.description) newPerson.description = "";
        if (!newPerson.reviewDate) newPerson.reviewDate = undefined;
        this.save(newPerson as any);
    }

    save(person: SerializedPerson) {
        return this.tableFuncs.save(person);
    }
}
