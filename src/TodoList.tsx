import { createServerQuery } from "../lib";
import { TodoCheckbox } from "./CheckTodoItem";
import { CreateTodoItem } from "./CreateTodoItem";
import { DeleteTodoButton } from "./DeleteTodoButton";
import type { Context } from "./server";

export const useTodoList = createServerQuery((params: {}, ctx: Context) => {
  return ctx.prisma.todo.findMany();
});

export const TodoList = () => {
  const { data, isLoading, refetch } = useTodoList({});
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {data?.data.map(todo => (
          <li key={todo.id}>
            <TodoCheckbox todoId={todo.id} onCheck={() => refetch()} />
            {todo.completed ? <del>{todo.title}</del> : todo.title}
            <DeleteTodoButton
              todoId={todo.id}
              onDelete={() => { refetch() }}
            />
          </li>
        ))}
        <CreateTodoItem onAdd={() => { refetch() }} />
      </ul>
    </div>
  )
}