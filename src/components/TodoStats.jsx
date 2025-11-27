const StatCard = ({ value, label, bgColor, textColor }) => (
  <div className={`${bgColor} py-2 md:p-3 rounded-lg text-center`}>
    <div className={`text-xl md:text-2xl font-bold ${textColor}`}>{value}</div>
    <div className={`text-xs md:text-sm ${textColor} opacity-75`}>{label}</div>
  </div>
);

const TodoStats = ({ total, active, completed }) => {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 sm:mb-6 text-center">
      <StatCard value={total} label="Всего" bgColor="bg-blue-100" textColor="text-blue-600" />
      <StatCard
        value={active}
        label="Активные"
        bgColor="bg-yellow-100"
        textColor="text-yellow-600"
      />
      <StatCard
        value={completed}
        label="Выполнены"
        bgColor="bg-green-100"
        textColor="text-green-600"
      />
    </div>
  );
};

export default TodoStats;
