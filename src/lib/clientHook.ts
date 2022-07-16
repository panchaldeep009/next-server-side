export type ClinetHook<Params, Return> = (params: Params) => {
  loading: boolean;
  params: Params;
  data?: Return;
}

export const clientHook = <Params, Return>(name: string): ClinetHook<Params, Return> => (params) => {
  return {
    loading: false,
    params: {} as Params,
    data: {} as Return
  }
}

export const outPutClientHook = (hookName: string) => {
  return {
    loading: false,
    params: {},
    data: {}
  }
}