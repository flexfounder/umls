function SettingsApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [settings, setSettings] = React.useState({
      notifications: true,
      autoSync: false,
      offlineMode: true,
      apiEndpoint: 'https://kimawasco.utilitymis.com/kimapi'
    });
    const [alert, setAlert] = React.useState(null);

    React.useEffect(() => {
      const session = getSession();
      if (!session) {
        window.location.href = 'index.html';
        return;
      }
      setUser(session);
      loadSettings();
    }, []);

    const loadSettings = () => {
      const saved = localStorage.getItem('app_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    };

    const handleSave = () => {
      localStorage.setItem('app_settings', JSON.stringify(settings));
      setAlert({ type: 'success', message: 'Settings saved successfully' });
    };

    if (!user) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header userName={user.employee_name} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
          
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500">Receive push notifications</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Auto Sync</h3>
                  <p className="text-sm text-gray-500">Automatically sync data</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, autoSync: !settings.autoSync})}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.autoSync ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.autoSync ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Offline Mode</h3>
                  <p className="text-sm text-gray-500">Enable offline data access</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, offlineMode: !settings.offlineMode})}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.offlineMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.offlineMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
                <input
                  type="text"
                  value={settings.apiEndpoint}
                  onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => {
                  if (confirm('Clear all cached data?')) {
                    localStorage.clear();
                    setAlert({ type: 'success', message: 'Cache cleared successfully' });
                  }
                }}
                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Clear Cache
              </button>

              <button
                onClick={handleSave}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Settings app error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SettingsApp />);