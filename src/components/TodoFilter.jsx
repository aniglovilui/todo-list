const TodoFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'Все' },
    { key: 'active', label: 'Активные' },
    { key: 'completed', label: 'Выполненные' },
  ];

  return (
    <div className="flex space-x-2 mb-4 sm:mb-6">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-2 sm:px-4 py-2 rounded-lg transition-colors text-sm md:text-lg ${
            currentFilter === filter.key
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } shadow-sm`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TodoFilter;
