import deepMerge from "deepmerge";
import { readFileSync } from "fs";
import { resolve } from "path";
import { debugMsgFactory, ManageableTimer, yconsole } from "ystd";
// import oracledb from "oracledb";
// import { OracleConnection0 } from "Yoracle";
import express from "express";
import { publishApis } from "./controllers";
import http from "http";
import initDatabase, { Database } from "better-sqlite3";
// @ts-ignore
import cors from "cors";
// @ts-ignore
import nodeSSPI from "express-node-sspi";

import { TaskServerModel } from "./models";
import { PersonServerModel } from "./models/person";

const debug = debugMsgFactory("startup");

// export interface OracleSettings {
//     user: string;
//     password: string;
//     connectString: string;
//     schema?: string;
// }

export interface EnvSettings {
    //    oracle: OracleSettings;
    noDbTest: false;
    port: number;
    instanceName: string;
}

export const defaultSettings = (): EnvSettings => ({
    port: 4300,
    instanceName: "unnamed",
    //    oracle: {} as any,
    noDbTest: false,
});

//export type DbProviderCallback<T> = (db: OracleConnection0) => Promise<T>;

export interface Env {
    terminating: boolean;
    onTerminateCallbacks: (() => void)[];
    versionStr: string;
    args: any;
    settings: EnvSettings;
    //    dbProvider: <T>(callback: (db: OracleConnection0) => Promise<T>) => Promise<T>;
    timers: Set<ManageableTimer>;
    terminate: () => void | Promise<void>;
    db: Database;

    taskModel: TaskServerModel;
    personModel: PersonServerModel;
}

export interface IssueLoaderVersion {
    major?: number;
    minor?: number;
    build?: number;
}

export const startEnv = async (args?: any): Promise<Env> => {
    const pthis = ({
        args,
        onTerminateCallbacks: [],
        terminating: false,
        timers: new Set(),
        terminate: () => {
            for (let callback of pthis.onTerminateCallbacks) callback();
            pthis.terminating = true;
            for (let timer of pthis.timers) timer.cancel();
        },
    } as any) as Env;

    yconsole.log(`CODE00000094`, `Starting ysurvey...`);
    const settingsPath = resolve("./settings.json");
    yconsole.log(`CODE00000197`, `settingsPath = ${settingsPath}`);

    const settings = deepMerge(defaultSettings(), JSON.parse(readFileSync(settingsPath, "utf-8")));
    if (settings.port) yconsole.log(`CODE00000198`, `Api server on port ${settings.port}`);

    let v: IssueLoaderVersion = {};
    try {
        v = JSON.parse(readFileSync("version.json", "utf-8"));
    } catch (e) {
        if (e.code !== "ENOENT") throw e;
    }
    const versionStr = `${v.major || 0}.${v.minor || 0}.${v.build || 0}`;
    yconsole.log(`CODE00000199`, `version = ${versionStr}`);

    yconsole.log(`CODE00000307`, `Load settings - finished`);
    // const DISABLE_ORACLE = true;
    // const dbMutex = ymutex();
    // const dbProvider = async function<T>(callback: DbProviderCallback<T>) {
    //     return dbMutex.lock(async function() {
    //         oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    //         const db = ((await oracledb.getConnection(settings.oracle)) as any) as OracleConnection0;
    //         await db.execute(`alter session set NLS_DATE_FORMAT='YYYY-MM-DD'`);
    //         await db.execute(`alter session set NLS_TIME_FORMAT='HH24:MI:SSXFF'`);
    //         await db.execute(`alter session set NLS_TIMESTAMP_FORMAT='YYYY-MM-DD"T"hh24:mi:ss.ff'`);
    //         await db.execute(`alter session set NLS_TIME_TZ_FORMAT='HH24:MI:SSXFF TZR'`);
    //         await db.execute(`alter session set NLS_TIMESTAMP_TZ_FORMAT='YYYY-MM-DD"T"hh24:mi:ss.ffTZHTZM'`);
    //         if (settings.oracle.schema) await db.execute(`ALTER SESSION SET CURRENT_SCHEMA=${settings.oracle.schema}`);
    //
    //         const r = await callback(db);
    //         await db.close();
    //         return r;
    //     });
    // };
    //
    // if (!DISABLE_ORACLE && !settings.noDbTest) {
    //     yconsole.log(`CODE00000110`, `Testing Oracle connection '${settings.oracle.connectString}'...`);
    //     const oracleVersion = await dbProvider(async function(db: OracleConnection0): Promise<any> {
    //         const r = await db.execute(
    //             `SELECT * from v$version`,
    //             [] // bind value for :id
    //         );
    //         // @ts-ignore
    //         return Object.values(r.rows[0])[0];
    //     });
    //     if (!oracleVersion || !oracleVersion.length)
    //         yconsole.error(`CODE00000111`, `Couldn't connect to Oracle. Will retry later...`);
    //     else yconsole.log(`CODE00000112`, `Connected to Oracle '${oracleVersion}' - OK`);
    // }
    const dbFilename = resolve(`tasks.db`);
    yconsole.log(`CODE00000308`, `Opening DB at ${dbFilename}`);
    const db = initDatabase(dbFilename);

    const env = Object.assign(pthis, {
        versionStr,
        args,
        settings,
        db,
        //        dbProvider,
    } as Env);

    yconsole.log(`CODE00000284`, `startApiServer`);
    if (!env.settings.port) throw new Error(`CODE00000183 No port specified!`);

    //    const sspiInstance = nodeSSPI({ retrieveGroups: false });
    const app = express();
    app.use(cors());
    // app.use(function(req, res, next) {
    //      res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    //      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //      next();
    // });

    if (!process.argv.join(" ").includes("--devuser=")) {
        app.use(nodeSSPI({ retrieveGroups: false }));
    } else {
        console.log(`CODE00000291 devuser is set! No SSPI! ${process.argv.join(" ")}`);
    }

    app.use(express.json());

    // app.use(function(req, res, next) {
    //     try {
    //         sspiInstance(req, res, next);
    //     } catch (e) {
    //         console.error(`CODE00000281 sspiInstance error ${sspiInstance.message}`);
    //     }
    //     next();
    // });

    // app.use(function(req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //     next();
    // });

    //    app.use(cors());

    app.use(express.static("public"));

    env.taskModel = new TaskServerModel(env);
    env.personModel = new PersonServerModel(env);

    publishApis(env, app);

    let httpServer = http.createServer(app);

    const httpServerInstance = httpServer.listen(env.settings.port, () => {
        console.log(
            `CODE00000282`,
            `Started /runStatus and /api/runStatus monitor endpoint on port ${env.settings.port}...`
        );
        yconsole.log(
            `CODE00000283`,
            `Started /runStatus and /api/runStatus monitor endpoint on port ${env.settings.port}...`
        );
    });

    env.onTerminateCallbacks.push(() => {
        httpServerInstance.close();
    });
    yconsole.log(`CODE00000279`, `startEnv - finished`);
    return env;
};
