import { Context } from "./interfaces";
import { createServerQuery } from "./lib/createServerHook"
import { someBackendThing } from "./SomeBackendCode";

const useATableDataQuery = createServerQuery(({ tableId }: { tableId:string }, ctx: Context) => {
  const someServerSideThing = 'someServerSideThing' || someBackendThing;
  return {
    name: 'aTableData',
  }
})

export const App = () => {
  const { data, loading } = useATableDataQuery({ tableId: "1" });
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Hello, {data?.name} </h1>
    </div>
  )
}