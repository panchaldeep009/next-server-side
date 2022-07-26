import { useState } from "react";
import { createServerMutation } from "../lib";
import type { Context } from "./server";

export const useTodoItemAdd = createServerMutation((params: { text: string }, ctx: Context) => {
  return ctx.prisma.todo.create({
    data: {
      title: params.text,
      completed: false,
    }
  })
});

interface CreateTodoProps {
  onAdd: () => void;
}

export const CreateTodoItem = ({ onAdd }: CreateTodoProps) => {
  const [text, setText] = useState('');
  const { mutate, isLoading } = useTodoItemAdd({
    onSuccess() {
      onAdd();
      setText('');
    }
  });

  return (
    <>
    <input type="text" value={text} onChange={e => setText(e.target.value)} />
    <button onClick={() => mutate({ text })}>
      {!isLoading ? 'Add' : 'Adding...'}
    </button>
    </>
  )
}