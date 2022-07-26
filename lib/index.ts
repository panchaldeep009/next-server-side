import { MutateOptions, useMutation, UseMutationResult, useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import Case from 'case';

function createServerQuery <Params, Return>(_serverFunction: (param: Params, ctx: any) => Promise<Return> | Return) {
  return (_serverFunction) as unknown as (params: Params, options?: Omit<UseQueryOptions<unknown, unknown, unknown, (string | Params)[]>, "initialData" | "queryFn" | "queryKey">) => UseQueryResult<AxiosResponse<Return>>;
}

function createClientQuery <Params, Return>(queryName: string) {
  return (params: Params, options: any) => {
    const requestName = Case.kebab(queryName.replace(/^use/, ''));
    const fetchService = () => axios.get<Return>(`/api/query/${requestName}`, {
      params,
    });
    
    return useQuery([queryName, params], fetchService, options);
  }
} 

function createServerMutation <Params, Return>(_serverFunction: (param: Params, ctx: any) => Promise<Return> | Return) {
  return (_serverFunction) as unknown as (mutationOptions?: Omit<MutateOptions<AxiosResponse<Return>, unknown, Params>, 'mutationFn'>) => UseMutationResult<AxiosResponse<Return>, unknown, Params>;
}

function createClientMutation <Params, Return>(queryName: string) {
  return (mutationOptions: any) => {
    const requestName = Case.kebab(queryName.replace(/^use/, ''));
    const fetchService = (body: Params) => axios.post<Return>(`/api/mutation/${requestName}`, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return useMutation(fetchService, mutationOptions);
  }
} 

export { createServerQuery, createClientQuery, createServerMutation, createClientMutation };