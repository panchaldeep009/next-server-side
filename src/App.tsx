import { Context } from "./interfaces";
import { createServerQuery } from "../lib";
import { someBackendThing } from "./SomeBackendCode";

export const useATableDataQuery = createServerQuery(({ tableId }: { tableId:string }, ctx: Context) => {
  const someServerSideThing = 'someServerSideThing' || someBackendThing;
  return {
    name: 'some name on the dfgdg :' + tableId,
  }
});

export const App = () => {
  const { data, isLoading } = useATableDataQuery({ tableId: "1" });
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Hello, {data?.data.name} </h1>
    </div>
  )
}