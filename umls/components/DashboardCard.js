function DashboardCard({ icon, title, description, color, onClick }) {
  try {
    return (
      <div
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 border border-gray-100"
        onClick={onClick}
        data-name="dashboard-card"
        data-file="components/DashboardCard.js"
      >
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
          <div className={`icon-${icon} text-xl text-white`}></div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    );
  } catch (error) {
    console.error('DashboardCard component error:', error);
    return null;
  }
}