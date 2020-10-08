import { Env } from "../startApiServer";
import { Express } from "express";
import { publishTaskApis } from "./task";
import { publishPersonApis } from "./person";

export function publishApis(env: Env, app: Express) {
    publishTaskApis(env, app);
    publishPersonApis(env, app);
}
