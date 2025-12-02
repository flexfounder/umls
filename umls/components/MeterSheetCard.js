function MeterSheetCard({ sheet, onClick }) {
  try {
    const pending = sheet.pending_count || 0;
    const completed = sheet.completed_count || 0;
    const isExpired = new Date(sheet.due_date) < new Date();

    return (
      <div
        className={`bg-white rounded-lg shadow-sm p-6 border ${
          isExpired ? 'border-red-200 opacity-60' : 'border-gray-100 cursor-pointer hover:shadow-md'
        } transition-shadow`}
        onClick={isExpired ? undefined : onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {sheet.sheet_name}
            </h3>
            <p className="text-sm text-gray-500">
              Due: {new Date(sheet.due_date).toLocaleDateString()}
              {isExpired && <span className="text-red-600 ml-2">(Expired)</span>}
            </p>
          </div>
          {!isExpired && <div className="icon-chevron-right text-xl text-gray-400"></div>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completed}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('MeterSheetCard error:', error);
    return null;
  }
}