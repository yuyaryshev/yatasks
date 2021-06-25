import { Env } from "../startApiServer.js";
//
import { debugMsgFactory as debugjs } from "Ystd";
import { Express } from "express";
import {
    CurrentTasksApiResponse,
    decoderCurrentTasksApiRequest,
    decoderCurrentTasksApiResponse,
    decoderSearchApiRequest,
    decoderSearchApiResponse,
    decoderTaskGetApiRequest,
    decoderTaskGetApiResponse,
    decoderTaskPostApiRequest,
    decoderTaskPostApiResponse,
    decoderTasksAllLabelsApiResponse,
    SearchApiResponse,
    TaskGetApiResponse,
    TaskPostApiResponse,
    TasksAllLabelsApiResponse,
} from "../../api/task.js";

const debug = debugjs("surveyApi");

export function publishTaskApis(env: Env, app: Express) {
    app.get("/api/search", async function taskSearchApi(req, res) {
        const ts = new Date().toISOString();
        let error: string | undefined = "CODE00000204 Unknown error";
        let ok: boolean = false;

        try {
            const { q } = decoderSearchApiRequest.runWithException(req.query);
            const tasks = env.taskModel.searchTasks(q);

            return res.send(
                JSON.stringify(
                    decoderSearchApiResponse.runWithException({
                        ok: true,
                        tasks,
                        totalCount: tasks.length,
                    } as SearchApiResponse)
                )
            );
        } catch (e) {
            error = "CODE00000312 " + e.message;
            console.error(error);
        }

        return res.send(
            JSON.stringify({
                ok: false,
                error,
            })
        );
    });

    app.get("/api/tasks_current", async function taskSearchApi(req, res) {
        const ts = new Date().toISOString();
        let error: string | undefined = "CODE00000201 Unknown error";
        let ok: boolean = false;

        try {
            const params = decoderCurrentTasksApiRequest.runWithException(req.query);
            const tasks = env.taskModel.currentTasks();

            // @ts-ignore
            return res.send(
                JSON.stringify(
                    decoderCurrentTasksApiResponse.runWithException({
                        ok: true,
                        tasks,
                        totalCount: tasks.length,
                    } as CurrentTasksApiResponse)
                )
            );
        } catch (e) {
            error = "CODE00000298 " + e.message;
            console.error(error);
        }

        return res.send(
            JSON.stringify({
                ok: false,
                error,
            })
        );
    });

    app.get("/api/tasks_all_labels", async function tasksAllLabelsApi(req, res) {
        const ts = new Date().toISOString();
        let error: string | undefined = "CODE00000096 Unknown error";
        let ok: boolean = false;

        try {
            // const params = decoderTasksAllLabelsApiRequest.runWithException(req.query);
            const labels = env.taskModel.tasksAllLabels();

            // @ts-ignore
            return res.send(
                JSON.stringify(
                    decoderTasksAllLabelsApiResponse.runWithException({
                        ok: true,
                        labels,
                        totalCount: labels.length,
                    } as TasksAllLabelsApiResponse)
                )
            );
        } catch (e) {
            error = "CODE00000299 " + e.message;
            console.error(error);
        }

        return res.send(
            JSON.stringify({
                ok: false,
                error,
            })
        );
    });

    app.get("/api/task", async function taskGetApi(req, res) {
        const ts = new Date().toISOString();
        let error: string | undefined = "CODE00000206 Unknown error";
        let ok: boolean = false;

        try {
            const { id, uid } = decoderTaskGetApiRequest.runWithException(req.query);
            const task = env.taskModel.getTask(id, uid);

            return res.send(
                JSON.stringify(
                    decoderTaskGetApiResponse.runWithException({
                        ok: true,
                        task,
                    } as TaskGetApiResponse)
                )
            );
        } catch (e) {
            error = "CODE00000300 " + e.message;
            console.error(error);
        }

        return res.send(
            JSON.stringify({
                ok: false,
                error,
            })
        );
    });

    app.post("/api/task", async function taskPostApi(req, res) {
        const ts = new Date().toISOString();
        let error: string | undefined = "CODE00000186 Unknown error";
        let ok: boolean = false;

        try {
            const { tasks } = decoderTaskPostApiRequest.runWithException(req.body);

            for (let task of tasks) await env.taskModel.applyChange(task);

            return res.send(
                JSON.stringify(
                    decoderTaskPostApiResponse.runWithException({
                        ok: true,
                    } as TaskPostApiResponse)
                )
            );
        } catch (e) {
            error = "CODE00000301 " + e.message;
            console.error(error);
        }

        return res.send(
            JSON.stringify({
                ok: false,
                error,
            })
        );
    });
}

// Авторизация, пока мне не актуальна
// if (process.argv.join(" ").includes("--devuser=")) {
//     req.connection.user = process.argv.join(" ").split("--devuser=")[1];
// }

// export async function surveyApiPost(env: Env, req: any, res: any) {
//     //    const ts = (new Date()).toISOString();
//     let error: string | undefined = undefined;
//     let ok: boolean = false;
//
//     const body = decoderSurveyPostApiRequest.runWithException(req.body);
//
//     if (process.argv.join(" ").includes("--devuser=")) {
//         req.connection.user = process.argv.join(" ").split("--devuser=")[1];
//     }
//
//     try {
//         await saveResponses(body, req.connection.user);
//
//         return res.send(
//             JSON.stringify(
//                 decoderSurveyPostApiResponse.runWithException({
//                     ok: true,
//                 } as SurveyPostApiResponse)
//             )
//         );
// } catch (e) {
//     error = "CODE00000302 "+e.message;
//     console.error(error);
// }
//
//     ok = true;
//
//     return res.send(
//         JSON.stringify({
//             ok,
//             error,
//         })
//     );
// }
