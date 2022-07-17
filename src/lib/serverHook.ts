import { Context } from "../interfaces"

export const serverHook = <Param, Return>(name: string, serverFunction: (param: Param, ctx: Context) => Promise<Return> | Return) => () => {
  return undefined
}