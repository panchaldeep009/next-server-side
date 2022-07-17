export type ClinetHook<Params, Return> = (params: Params) => {
  loading: boolean;
  params: Params;
  data?: Return;
};

export const ClientQuery = (hookName: string) => {
  const blaBla = "Some Client thing";
  return {
    loading: false,
    params: {},
    data: {}
  }
}