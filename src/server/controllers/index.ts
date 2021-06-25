import { Env } from "../startApiServer.js";
import { Express } from "express";
import { publishTaskApis } from "./task.js";
import { publishPersonApis } from "./person.js";

export function publishApis(env: Env, app: Express) {
    publishTaskApis(env, app);
    publishPersonApis(env, app);
}
