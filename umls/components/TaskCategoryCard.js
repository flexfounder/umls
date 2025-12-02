function TaskCategoryCard({ category, onClick }) {
  try {
    const assigned = category.assigned_count || 0;
    const completed = category.completed_count || 0;

    return (
      <div
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {category.name || category.task_type_name}
            </h3>
          </div>
          <div className="icon-chevron-right text-xl text-gray-400"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Assigned</p>
            <p className="text-2xl font-bold text-blue-600">{assigned}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completed}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('TaskCategoryCard error:', error);
    return null;
  }
}