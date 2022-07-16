import { Context } from "../interfaces";
import { clientHook, ClinetHook } from "./clientHook";
import { serverHook } from "./serverHook";

export const createServerQuery = <Param, Return>(hook: (param: Param, ctx: Context) => Promise<Return> | Return) => {
  const name = `serverHook_${Math.random()}`;
  if (serverHook) {
    return serverHook<Param, Return>(name, hook) as unknown as ClinetHook<Param, Return>;
  }
  return clientHook<Param, Return>(name);
}