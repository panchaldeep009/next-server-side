import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { Express } from 'express';

function createServerQuery <Params, Return>(queryName: string, _serverFunction: (param: Params, ctx: any) => Promise<Return> | Return) {
  return (
    (app: Express) => {
      app.get(`/api/query/${queryName}`, async (req, res) => {
        const result = await _serverFunction(req.query as unknown as Params, undefined);
        res.json(result);
      });
    }
  ) as unknown as (params: Params) => UseQueryResult<AxiosResponse<Return>>;
}

export { createServerQuery };