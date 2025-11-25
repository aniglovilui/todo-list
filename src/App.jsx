import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
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

  // обработчик esc для модалки ????????????????
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && isHelpModalOpen) {
        setIsHelpModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isHelpModalOpen]);

  // фильтрация задач ?????????????????????
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
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalTodos}</div>
                <div className="text-sm text-blue-500">Всего</div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{activeTodos}</div>
                <div className="text-sm text-yellow-500">Активные</div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedTodos}</div>
                <div className="text-sm text-green-500">Выполнены</div>
              </div>
            </div>

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
      {isHelpModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeHelpModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()} // предотвращаем закрытие при клике на контент
          >
            <div className="p-6">
              {/* заголовок модалки */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <HelpCircle size={24} className="text-blue-500" />
                  <span>Подсказки по использованию</span>
                </h2>
                <button
                  onClick={closeHelpModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* содержимое подсказок */}
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Добавление задач</h3>
                    <p>Введите текст в поле ввода и нажмите "Добавить" или Enter</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Отметка выполнения</h3>
                    <p>Кликните на круг слева от задачи для отметки выполнения</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-purple-600 text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Редактирование</h3>
                    <p>Нажмите на иконку карандаша для редактирования текста задачи</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Удаление</h3>
                    <p>Нажмите на иконку крестика для удаления задачи</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-yellow-600 text-sm">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Фильтрация</h3>
                    <p>
                      Используйте кнопки фильтров для просмотра всех, активных или выполненных задач
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-gray-600 text-sm">💾</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Автосохранение</h3>
                    <p>Все задачи автоматически сохраняются в вашем браузере</p>
                  </div>
                </div>
              </div>

              {/* горячие клавиши */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Горячие клавиши</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Esc</span>
                    <span className="text-gray-600">Закрыть модальное окно</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enter</span>
                    <span className="text-gray-600">Добавить/сохранить задачу</span>
                  </div>
                </div>
              </div>

              {/* кнопка закрытия */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeHelpModal}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Понятно
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
