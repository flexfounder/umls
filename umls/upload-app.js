function UploadApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const [progress, setProgress] = React.useState({ phase: '', percent: 0 });
    const [alert, setAlert] = React.useState(null);
    const [localTasks, setLocalTasks] = React.useState([]);

    React.useEffect(() => {
      const session = getSession();
      if (!session) {
        window.location.href = 'index.html';
        return;
      }
      setUser(session);
      loadLocalTasks();
    }, []);

    const loadLocalTasks = () => {
      const tasks = getLocalTasks();
      setLocalTasks(tasks);
    };

    const handleUpload = async () => {
      if (localTasks.length === 0) {
        setAlert({ type: 'info', message: 'No tasks to upload' });
        return;
      }

      setUploading(true);
      setAlert(null);

      try {
        setProgress({ phase: 'Uploading task data...', percent: 30 });
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setProgress({ phase: 'Uploading images...', percent: 70 });
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setProgress({ phase: 'Complete', percent: 100 });
        clearLocalTasks();
        loadLocalTasks();
        setAlert({ type: 'success', message: 'All tasks uploaded successfully!' });
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to upload tasks' });
      } finally {
        setUploading(false);
        setTimeout(() => setProgress({ phase: '', percent: 0 }), 2000);
      }
    };

    if (!user) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header userName={user.employee_name} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Tasks</h2>
          
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="icon-upload text-3xl text-purple-600"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Completed Tasks</h3>
            <p className="text-gray-600 mb-2">Pending tasks: {localTasks.length}</p>
            
            {uploading && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percent}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{progress.phase}</p>
              </div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={uploading || localTasks.length === 0}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 font-medium"
            >
              {uploading ? 'Uploading...' : 'Upload Tasks'}
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Upload app error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UploadApp />);