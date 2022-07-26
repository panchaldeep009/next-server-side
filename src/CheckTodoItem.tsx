import { createServerMutation } from "../lib";
import type { Context } from "./server";

export const useTodoCheck = createServerMutation((params: { todoId: string, checked: boolean }, ctx: Context) => {
  return ctx.prisma.todo.update({
    data: {
      completed: params.checked,
    },
    where: { id: params.todoId }
  });
});

interface TodoCheckboxProps {
  todoId: string;
  onCheck: () => void;
}

export const TodoCheckbox = ({ todoId, onCheck }: TodoCheckboxProps) => {
  const { mutate } = useTodoCheck({
    onSuccess() {
      onCheck();
    }
  });

  return (
    <input type="checkbox" onChange={(e) => mutate({ todoId: todoId, checked: e.target.checked })} />
  )
}