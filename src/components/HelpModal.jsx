import { HelpCircle, X } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const tips = [
    {
      icon: '💾',
      color: 'plain',
      title: 'Автосохранение',
      description:
        'Все данные сохраняются автоматически: задачи, текст ввода, режим редактирования и выбранный фильтр',
    },
    {
      icon: '1',
      color: 'blue',
      title: 'Добавление задач',
      description: 'Введите текст в поле ввода и нажмите "Добавить" или Enter',
    },
    {
      icon: '2',
      color: 'green',
      title: 'Отметка выполнения',
      description: 'Кликните на круг слева от задачи для отметки выполнения',
    },
    {
      icon: '3',
      color: 'purple',
      title: 'Редактирование',
      description: 'Нажмите на иконку карандаша для редактирования текста задачи',
    },
    {
      icon: '4',
      color: 'red',
      title: 'Удаление',
      description: 'Нажмите на иконку крестика для удаления задачи',
    },
    {
      icon: '5',
      color: 'yellow',
      title: 'Фильтрация',
      description:
        'Используйте кнопки фильтров для просмотра всех, активных или выполненных задач. Выбранный фильтр сохраняется',
    },
  ];

  const hotKeys = [
    {
      title: 'Esc',
      description: 'Закрыть модальное окно',
    },
    {
      title: 'Enter',
      description: 'Добавить/сохранить задачу',
    },
  ];

  const getColorClasses = color => {
    const colors = {
      plain: 'bg-trsnsparent text-gray-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto modal-content"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          {/* заголовок */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg sm:text-xl font-bold text-gray-800 flex items-center space-x-3">
              {/* <HelpCircle size={24} className="text-blue-500" /> */}
              <h2 className="text-wrap">Подсказки по использованию</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>
          </div>

          {/* содержимое подсказок */}
          <div className="space-y-4 text-gray-600">
            {tips.map(({ title, color, icon, description }) => (
              <div key={title} className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${getColorClasses(
                    color
                  )}`}
                >
                  <span className="text-sm font-medium">{icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{title}</h3>
                  <p className="text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* горячие клавиши */}
          <div className="mt-6 p-2 sm:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Горячие клавиши</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              {hotKeys.map(({ title, description }) => (
                <div key={title} className="flex justify-between">
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded">
                    {title}
                  </kbd>
                  <span className="text-gray-600">{description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* кнопка закрытия */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Понятно
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
