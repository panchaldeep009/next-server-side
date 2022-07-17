export type ClinetHook<Params, Return> = (params: Params) => {
  loading: boolean;
  params: Params;
  data?: Return;
};
