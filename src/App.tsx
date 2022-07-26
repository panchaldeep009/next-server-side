import { createServerQuery } from "../lib";
import { TodoList } from "./TodoList";

export const useGreeting = createServerQuery((params: { name : string }) => {
  return {
    sentance: 'Hello ' + params.name,
  }
});

export const App = () => {
  const { data, isLoading } = useGreeting({ name: 'World' });
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{data?.data.sentance}</h1>
      <TodoList />
    </div>
  )
}