import { Env } from "../startApiServer";
//
import { debugMsgFactory as debugjs } from "Ystd";
import { Express } from "express";
import {
    CurrentPersonsApiResponse,
    decoderCurrentPersonsApiResponse,
    decoderPersonGetApiRequest,
    decoderPersonGetApiResponse,
    decoderPersonPostApiRequest,
    decoderPersonPostApiResponse,
    decoderSearchPersonApiRequest,
    decoderSearchPersonApiResponse,
    PersonGetApiResponse,
    PersonPostApiResponse,
    SearchPersonApiResponse,
} from "../../api/person";

const debug = debugjs("surveyApi");

export function publishPersonApis(env: Env, app: Express) {
    app.get("/api/search", async function personSearchPersonApi(req, res) {
        const ts = new Date().toISOString();
        let error: string | undefined = "CODE00000101 Unknown error";
        let ok: boolean = false;

        try {
            const { q } = decoderSearchPersonApiRequest.runWithException(req.query);
            const persons = env.personModel.searchPersons(q);

            return res.send(
                JSON.stringify(
                    decoderSearchPersonApiResponse.runWithException({
                        ok: true,
                        persons,
                        totalCount: persons.length,
                    } as SearchPersonApiResponse)
                )
            );
        } catch (e) {
            error = "CODE00000202 " + e.message;
            console.error(error);
        }

        return res.send(
            JSON.stringify({
                ok: false,
                error,
            })
        );
    });

    app.get("/api/persons_current", async function personSearchPersonApi(req, res) {
        const ts = new Date().toISOString();
        let error: string | undefined = "CODE00000102 Unknown error";
        let ok: boolean = false;

        try {
            //const params = decoderCurrentPersonsApiRequest.runWithException(req.query);
            const persons = env.personModel.currentPersons();

            // @ts-ignore
            return res.send(
                JSON.stringify(
                    decoderCurrentPersonsApiResponse.runWithException({
                        ok: true,
                        persons,
                        totalCount: persons.length,
                    } as CurrentPersonsApiResponse)
                )
            );
        } catch (e) {
            error = "CODE00000205 " + e.message;
            console.error(error);
        }

        return res.send(
            JSON.stringify({
                ok: false,
                error,
            })
        );
    });

    app.get("/api/person", async function personGetApi(req, res) {
        const ts = new Date().toISOString();
        let error: string | undefined = "CODE00000103 Unknown error";
        let ok: boolean = false;

        try {
            const { id, uid } = decoderPersonGetApiRequest.runWithException(req.query);
            const person = env.personModel.getPerson(id, uid);

            return res.send(
                JSON.stringify(
                    decoderPersonGetApiResponse.runWithException({
                        ok: true,
                        person,
                    } as PersonGetApiResponse)
                )
            );
        } catch (e) {
            error = "CODE00000188 " + e.message;
            console.error(error);
        }

        return res.send(
            JSON.stringify({
                ok: false,
                error,
            })
        );
    });

    app.post("/api/person", async function personPostApi(req, res) {
        const ts = new Date().toISOString();
        let error: string | undefined = "CODE00000104 Unknown error";
        let ok: boolean = false;

        try {
            const { persons } = decoderPersonPostApiRequest.runWithException(req.body);

            for (let person of persons) await await env.personModel.applyChange(person);

            return res.send(
                JSON.stringify(
                    decoderPersonPostApiResponse.runWithException({
                        ok: true,
                    } as PersonPostApiResponse)
                )
            );
        } catch (e) {
            error = "CODE00000310 " + e.message;
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
//     error = "CODE00000311 "+e.message;
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
