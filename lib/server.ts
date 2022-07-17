import { ClinetHook } from './types';

export const createServerQuery = <Param, Return>(hook: (param: Param, ctx: any) => Promise<Return> | Return) => {
  return {} as ClinetHook<Param, Return>;
}