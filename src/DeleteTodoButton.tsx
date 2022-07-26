import { createServerMutation } from "../lib";
import type { Context } from "./server";

export const useTodoDelete = createServerMutation((params: { todoId: string }, ctx: Context) => {
  return ctx.prisma.todo.delete({ where: { id: params.todoId } });
});

interface DeleteTodoButtonProps {
  todoId: string;
  onDelete: () => void;
}

export const DeleteTodoButton = ({ todoId, onDelete }: DeleteTodoButtonProps) => {
  const { mutate, isLoading } = useTodoDelete({
    onSuccess() {
      onDelete();
    }
  });

  return (
    <button onClick={() => mutate({ todoId: todoId })}>
      {!isLoading ? 'Delete' : 'Deleting...'}
    </button>
  )
}