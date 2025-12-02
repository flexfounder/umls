function Header({ userName }) {
  try {
    return (
      <header className="bg-white shadow-sm" data-name="header" data-file="components/Header.js">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
              <div className="icon-droplets text-xl text-white"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Utility Management</h1>
              <p className="text-xs text-gray-500">Field Operations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="icon-user text-lg text-gray-600"></div>
            <span className="text-sm font-medium text-gray-700">{userName}</span>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}