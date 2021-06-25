// import block
import { debugMsgFactory, globalHandler } from "ystd";
import { startEnv } from "./server/startApiServer.js";

// currently unused
const debug = debugMsgFactory("run");

// function to connect to Oracle
// async function exampleOracleCall(env: Env) {
//     await env.dbProvider(async function(db: OracleConnection0) {
//         const response = await db.execute("select 77 x from dual");
//         console.log(response);
//         if (env.terminating) return;
//     });
// }

// error handler (partially used)
globalHandler(async function (args?: any) {
    if (!args) args = {};
    let env: any;

    try {
        env = await startEnv();
    } finally {
        //if (env) env.terminate();
    }
})();
