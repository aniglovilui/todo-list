// import { useState } from 'react';
import { Plus } from 'lucide-react';

const TodoForm = ({ inputText, setInputText, onAdd, editingTodo, onSaveEdit, onCancelEdit }) => {
  // Используем editingTodo.text как начальное значение
  // const [inputValue, setInputValue] = useState(editingTodo?.text || '');

  const handleSubmit = e => {
    e.preventDefault();
    const trimmedValue = inputText.trim();

    if (trimmedValue) {
      if (editingTodo) {
        onSaveEdit(editingTodo.id, trimmedValue);
      } else {
        onAdd(trimmedValue);
      }
      // Не сбрасываем inputText здесь - это делается в App после успешного добавления/сохранения
    }
  };

  const handleCancel = () => {
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={editingTodo ? 'Редактировать задачу...' : 'Добавить новую задачу...'}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          autoFocus={!!editingTodo} // Автофокус при редактировании
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Plus size={20} />
          <span>{editingTodo ? 'Сохранить' : 'Добавить'}</span>
        </button>
        {editingTodo && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
