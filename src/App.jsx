import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import TodoStats from './components/TodoStats';
import HelpModal from './components/HelpModal';
import { ClipboardList, HelpCircle } from 'lucide-react';

function App() {
  // функция инициализации начальных состояний
  const initializeState = () => {
    try {
      const savedTodos = localStorage.getItem('todos');
      const savedInputText = localStorage.getItem('todoInputText');
      const savedEditingId = localStorage.getItem('editingTodoId');
      const savedFilter = localStorage.getItem('todoFilter');

      const todos = savedTodos ? JSON.parse(savedTodos) : [];
      const inputText = savedInputText || '';
      const filter = savedFilter || 'all';

      // восстанавливаем редактирование только если задача существует
      let editingTodo = null;
      if (savedEditingId) {
        editingTodo = todos.find(todo => todo.id === savedEditingId) || null;
        // если задача не найдена очищаем невалидный id
        if (!editingTodo) {
          localStorage.removeItem('editingTodoId');
        }
      }

      return {
        todos,
        inputText,
        editingTodo,
        editingTodoId: editingTodo ? savedEditingId : null,
        filter,
      };
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
      return {
        todos: [],
        inputText: '',
        editingTodo: null,
        editingTodoId: null,
        filter: 'all',
      };
    }
  };

  const initialState = initializeState();

  const [todos, setTodos] = useState(initialState.todos);
  const [filter, setFilter] = useState(initialState.filter);
  const [editingTodo, setEditingTodo] = useState(initialState.editingTodo);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [inputText, setInputText] = useState(initialState.inputText);
  const [editingTodoId, setEditingTodoId] = useState(initialState.editingTodoId);

  // сохранения в localStorage

  useEffect(() => {
    try {
      localStorage.setItem('todoFilter', filter);
    } catch (error) {
      console.error('Error saving filter to localStorage:', error);
    }
  }, [filter]);

  useEffect(() => {
    try {
      localStorage.setItem('todoInputText', inputText);
    } catch (error) {
      console.error('Error saving input text:', error);
    }
  }, [inputText]);

  useEffect(() => {
    try {
      if (editingTodoId) {
        localStorage.setItem('editingTodoId', editingTodoId);
      } else {
        localStorage.removeItem('editingTodoId');
      }
    } catch (error) {
      console.error('Error saving editing state:', error);
    }
  }, [editingTodoId]);

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }, [todos]);

  // обработчик esc для модалки
  useEffect(() => {
    if (!isHelpModalOpen) {
      return;
    }
    const handleEscape = e => {
      if (e.key === 'Escape' && isHelpModalOpen) {
        setIsHelpModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isHelpModalOpen]);

  // фильтрация задач
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

  // обработчики
  const addTodo = text => {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setInputText('');
  };

  const toggleTodo = id => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = id => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

    if (editingTodo && editingTodo.id === id) {
      setEditingTodo(null);
      setEditingTodoId(null);
      setInputText('');
    }
  };

  const startEdit = todo => {
    setEditingTodo(todo);
    setEditingTodoId(todo.id);
    setInputText(todo.text);
  };

  const saveEdit = (id, newText) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    setEditingTodo(null);
    setEditingTodoId(null);
    setInputText('');
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditingTodoId(null);
    setInputText('');
  };

  const handleFilterChange = newFilter => {
    setFilter(newFilter);
  };

  const openHelpModal = () => setIsHelpModalOpen(true);
  const closeHelpModal = () => setIsHelpModalOpen(false);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* заголовок */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ClipboardList size={32} className="text-white" />
            <h1 className="text-4xl font-bold text-white">Мой список дел</h1>
          </div>
          {/* <p className="text-white/80">Организуйте свои задачи эффективно</p> */}
        </div>

        {/* основной контейнер */}
        <div className="flex flex-col h-[80vh] bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6">
          <div className="flex-shrink-0">
            {/* статистика */}
            <TodoStats total={totalTodos} active={activeTodos} completed={completedTodos} />

            {/* форма добавления */}
            <TodoForm
              key={editingTodo ? editingTodo.id : 'create'}
              inputText={inputText}
              setInputText={setInputText}
              onAdd={addTodo}
              editingTodo={editingTodo}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
            />

            {/* фильтры */}
            <TodoFilter currentFilter={filter} onFilterChange={handleFilterChange} />
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {/* список задач */}
            <TodoList
              todos={filteredTodos}
              {...{ onToggle: toggleTodo, onDelete: deleteTodo, onEdit: startEdit }}
            />
          </div>

          {/* подсказки */}
          <div className="flex-shrink-0 mt-4 mx-auto">
            <button
              onClick={openHelpModal}
              className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <HelpCircle size={18} />
              <span className="font-medium">Подсказки</span>
            </button>
          </div>
        </div>
      </div>

      {/* модальное окно подсказок */}
      <HelpModal isOpen={isHelpModalOpen} onClose={closeHelpModal} />
    </div>
  );
}

export default App;
