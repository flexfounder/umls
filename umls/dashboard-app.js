function DashboardApp() {
  try {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
      const session = getSession();
      if (!session) {
        window.location.href = 'index.html';
        return;
      }
      setUser(session);
    }, []);

    const menuItems = [
      { icon: 'refresh-cw', title: 'Sync', description: 'Sync data from server', link: 'sync.html', color: 'bg-blue-500' },
      { icon: 'list-checks', title: 'View Tasks', description: 'View assigned tasks', link: 'task-categories.html', color: 'bg-green-500' },
      { icon: 'upload', title: 'Upload Tasks', description: 'Upload completed tasks', link: 'upload.html', color: 'bg-purple-500' },
      { icon: 'alert-triangle', title: 'Report Incident', description: 'Report field incidents', link: 'incident.html', color: 'bg-red-500' },
      { icon: 'gauge', title: 'Read Meter', description: 'Meter reading tasks', link: 'meter-sheets.html', color: 'bg-orange-500' },
      { icon: 'users', title: 'Customer', description: 'Search customers', link: 'customer.html', color: 'bg-cyan-500' },
      { icon: 'settings', title: 'Settings', description: 'App settings', link: 'settings.html', color: 'bg-gray-500' },
      { icon: 'log-out', title: 'Logout', description: 'Sign out', link: '#', color: 'bg-gray-700' }
    ];

    const handleCardClick = (item) => {
      if (item.title === 'Logout') {
        clearSession();
        window.location.href = 'index.html';
      } else {
        window.location.href = item.link;
      }
    };

    if (!user) return null;

    return (
      <div className="min-h-screen bg-[var(--bg-light)]" data-name="dashboard" data-file="dashboard-app.js">
        <Header userName={user.employee_name} />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {menuItems.map((item, index) => (
              <DashboardCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                color={item.color}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard app error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DashboardApp />);