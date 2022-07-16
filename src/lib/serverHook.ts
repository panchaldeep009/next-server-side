export const serverHook = <Param, Return>(name: string, serverFunction: (param: Param) => Promise<Return> | Return) => () => {
  return undefined
}