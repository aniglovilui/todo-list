import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import { ClipboardList, Lightbulb } from 'lucide-react';

function App() {
  // Используем ленивую инициализацию состояния
  const [todos, setTodos] = useState(() => {
    // Выполняется только при первоначальном рендере
    try {
      const savedTodos = localStorage.getItem('todos');
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      return [];
    }
  });

  const [filter, setFilter] = useState('all');
  const [editingTodo, setEditingTodo] = useState(null);

  const [showTips, setShowTips] = useState(false);

  // Сохранение в localStorage при изменении todos
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }, [todos]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  const addTodo = text => {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos(prevTodos => [...prevTodos, newTodo]); // вспомнить почему функцией
  };

  const toggleTodo = id => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = id => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const startEdit = todo => {
    setEditingTodo(todo);
  };

  const saveEdit = (id, newText) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    setEditingTodo(null);
  };

  const cancelEdit = () => {
    setEditingTodo(null);
  };

  const toggleTips = () => {
    setShowTips(!showTips);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ClipboardList size={32} className="text-white" />
            <h1 className="text-4xl font-bold text-white">Мой список дел</h1>
          </div>
          {/* <p className="text-white/80">Организуйте свои задачи эффективно</p> */}
        </div>

        {/* Основной контейнер */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6">
          {/* Статистика */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalTodos}</div>
              <div className="text-sm text-blue-500">Всего</div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{activeTodos}</div>
              <div className="text-sm text-purple-500">Активные</div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedTodos}</div>
              <div className="text-sm text-green-500">Выполнены</div>
            </div>
          </div>

          {/* Форма добавления */}
          <TodoForm
            key={editingTodo ? editingTodo.id : 'create'} // Добавляем ключ
            onAdd={addTodo}
            editingTodo={editingTodo}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
          />

          {/* Фильтры */}
          <TodoFilter currentFilter={filter} onFilterChange={setFilter} />

          {/* Список задач */}
          <TodoList
            todos={filteredTodos}
            {...{ onToggle: toggleTodo, onDelete: deleteTodo, onEdit: startEdit }}
          />

          {/* Подсказки */}
          <div className="mt-6 text-center text-sm text-gray-500 space-y-1">
            <div
              onClick={toggleTips}
              className="flex justify-center items-center space-x-2 cursor-pointer"
            >
              <Lightbulb size={16} className="text-yellow-500" />
              <span className="text-sm font-medium">Подсказки</span>
            </div>
            {showTips && ( //переделать в ul?
              <div>
                <p>• Кликните на круг для отметки выполнения</p>
                <p>• Используйте иконку карандаша для редактирования</p>
                <p>• Задачи сохраняются автоматически</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
