import { Context } from "../interfaces";
import { ClinetHook } from "./clientHook";

export const createServerQuery = <Param, Return>(hook: (param: Param, ctx: Context) => Promise<Return> | Return) => {
  return {} as ClinetHook<Param, Return>;
}