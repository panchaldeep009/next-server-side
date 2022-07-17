import { Context } from "./interfaces";
import { createServerQuery } from "react-stack";
import { someBackendThing } from "./SomeBackendCode";

const useATableDataQuery = createServerQuery(({ tableId }: { tableId:string }, ctx: Context) => {
  const someServerSideThing = 'someServerSideThing' || someBackendThing;
  return {
    name: 'some name on the server',
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