// import { useState, useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import { useModal } from './hooks/useModal';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import TodoStats from './components/TodoStats';
import HelpModal from './components/HelpModal';
import { ClipboardList, HelpCircle } from 'lucide-react';

function App() {
  const {
    todos,
    filter,
    editingTodo,
    inputText,
    totalTodos,
    completedTodos,
    activeTodos,
    setInputText,
    addTodo,
    toggleTodo,
    deleteTodo,
    startEdit,
    saveEdit,
    cancelEdit,
    handleFilterChange,
  } = useTodos();

  // const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // // обработчик esc для модалки
  // useEffect(() => {
  //   if (!isHelpModalOpen) {
  //     return;
  //   }
  //   const handleEscape = e => {
  //     if (e.key === 'Escape' && isHelpModalOpen) {
  //       setIsHelpModalOpen(false);
  //     }
  //   };

  //   document.addEventListener('keydown', handleEscape);
  //   return () => document.removeEventListener('keydown', handleEscape);
  // }, [isHelpModalOpen]);

  // // фильтрация задач
  // const filteredTodos = todos.filter(todo => {
  //   switch (filter) {
  //     case 'active':
  //       return !todo.completed;
  //     case 'completed':
  //       return todo.completed;
  //     default:
  //       return true;
  //   }
  // });

  // const openHelpModal = () => setIsHelpModalOpen(true);
  // const closeHelpModal = () => setIsHelpModalOpen(false);

  const { isOpen: isHelpModalOpen, open: openHelpModal, close: closeHelpModal } = useModal();

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

          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
            {/* список задач */}
            <TodoList
              todos={todos}
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
