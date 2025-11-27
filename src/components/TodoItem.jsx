import { Check, X, Edit } from 'lucide-react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const { id, text, completed } = todo;
  return (
    <div
      className={`flex items-center justify-between p-2 sm:p-4 space-x-1 sm:space-x-2 bg-white rounded-lg shadow-md transition-all duration-200 ${
        completed ? 'opacity-60' : 'opacity-100'
      }`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <button
          onClick={() => onToggle(id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {completed && <Check size={14} className="text-white" />}
        </button>

        <div
          className={`break-words flex-1 ${
            completed ? 'line-through text-gray-500' : 'text-gray-800'
          }`}
        >
          {text}
        </div>
      </div>

      <div className="flex space-x-1 sm:space-x-2">
        <button
          onClick={() => onEdit(todo)}
          className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
