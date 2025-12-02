function TaskCard({ task }) {
  try {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800'
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{task.task_name || 'Task'}</h3>
            <p className="text-sm text-gray-500 mt-1">Type: {task.task_type || 'General'}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status] || 'bg-gray-100 text-gray-800'}`}>
            {task.status || 'pending'}
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="icon-map-pin text-base"></div>
            <span>{task.location || 'No location'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="icon-calendar text-base"></div>
            <span>{task.date ? new Date(task.date).toLocaleDateString() : 'No date'}</span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('TaskCard error:', error);
    return null;
  }
}