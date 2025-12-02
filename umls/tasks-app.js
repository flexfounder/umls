function TasksApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [tasks, setTasks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [alert, setAlert] = React.useState(null);
    const [filter, setFilter] = React.useState('all');

    React.useEffect(() => {
      const session = getSession();
      if (!session) {
        window.location.href = 'index.html';
        return;
      }
      setUser(session);
      loadTasks(session);
    }, []);

    const loadTasks = async (session) => {
      try {
        console.log('Loading tasks with token:', session.trongate_token ? 'Present' : 'Missing');
        const data = await fetchMyTasks(session.user_id, session.trongate_token);
        setTasks(data || []);
      } catch (error) {
        console.error('Tasks loading error:', error);
        const errorMsg = error.message.includes('401') 
          ? 'Session expired. Please login again.' 
          : 'Failed to load tasks. Please try again.';
        setAlert({ type: 'error', message: errorMsg });
        
        if (error.message.includes('401')) {
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    const filteredTasks = tasks.filter(task => {
      if (filter === 'all') return true;
      return task.status === filter;
    });

    if (!user) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header userName={user.employee_name} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
            <div className="flex gap-2 mt-4">
              {['all', 'pending', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

          {loading ? (
            <div className="text-center py-12">
              <div className="icon-loader-2 text-3xl text-blue-600 animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Tasks app error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TasksApp />);