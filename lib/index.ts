import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

function createServerQuery <Params, Return>(_serverFunction: (param: Params, ctx: any) => Promise<Return> | Return) {
  return (_serverFunction) as unknown as (params: Params) => UseQueryResult<AxiosResponse<Return>>;
}

function createClientQuery <Params, Return>(queryName: string) {
  return (params: Params) => {
    const fetchService = () => axios.get<Return>(`/api/query/${queryName}`, {
      params,
    });
    
    return useQuery([queryName, params], fetchService);
  }
} 

export { createServerQuery, createClientQuery };