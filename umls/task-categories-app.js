function TaskCategoriesApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const session = getSession();
      if (!session) {
        window.location.href = 'index.html';
        return;
      }
      setUser(session);
      loadCategories();
    }, []);

    const loadCategories = () => {
      const syncData = getSyncData();
      if (syncData && syncData.task_types) {
        setCategories(syncData.task_types);
      }
      setLoading(false);
    };

    const handleCategoryClick = (category) => {
      window.location.href = `task-list.html?category=${category.id}`;
    };

    if (!user) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header userName={user.employee_name} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Task Categories</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="icon-loader-2 text-3xl text-blue-600 animate-spin mx-auto"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No task categories synced. Please sync data first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(category => (
                <TaskCategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Task categories app error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TaskCategoriesApp />);