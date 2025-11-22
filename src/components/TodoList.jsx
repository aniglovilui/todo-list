import TodoItem from './TodoItem';

const TodoList = ({ todos, ...handlers }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
        Список задач пуст
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} {...handlers} />
      ))}
    </div>
  );
};

export default TodoList;
