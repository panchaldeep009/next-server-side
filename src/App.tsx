import { Context } from "./interfaces";
import { createServerQuery } from "./lib/createServerHook"

const useATableDataQuery = createServerQuery(({ tableId }: { tableId:string }, ctx: Context) => {
  return ctx.prismaClient.aTable.findOne({
    where: {
      id: tableId
    }
  })
})

export const App = () => {
  const { data, loading } = useATableDataQuery({ tableId: "1" });
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Hello, {data.name} </h1>
    </div>
  )
}