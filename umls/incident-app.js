function IncidentApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [formData, setFormData] = React.useState({
      incident_type: '',
      description: '',
      gps_latitude: '',
      gps_longitude: '',
      photos: []
    });
    const [submitting, setSubmitting] = React.useState(false);
    const [alert, setAlert] = React.useState(null);

    React.useEffect(() => {
      const session = getSession();
      if (!session) {
        window.location.href = 'index.html';
        return;
      }
      setUser(session);
      getLocation();
    }, []);

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData(prev => ({
              ...prev,
              gps_latitude: position.coords.latitude.toString(),
              gps_longitude: position.coords.longitude.toString()
            }));
          },
          (error) => console.log('GPS error:', error)
        );
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setAlert(null);

      try {
        const incidentData = {
          ...formData,
          user_id: user.user_id,
          timestamp: new Date().toISOString()
        };
        saveLocalTask(incidentData);
        setAlert({ type: 'success', message: 'Incident saved locally. Will sync when online.' });
        setFormData({ incident_type: '', description: '', gps_latitude: '', gps_longitude: '', photos: [] });
        getLocation();
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to save incident' });
      } finally {
        setSubmitting(false);
      }
    };

    if (!user) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header userName={user.employee_name} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Report Incident</h2>
          
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type</label>
                <select
                  value={formData.incident_type}
                  onChange={(e) => setFormData({...formData, incident_type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select type</option>
                  <option value="leak">Water Leak</option>
                  <option value="burst">Pipe Burst</option>
                  <option value="contamination">Water Contamination</option>
                  <option value="meter_damage">Meter Damage</option>
                  <option value="illegal_connection">Illegal Connection</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  rows="4"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPS Latitude</label>
                  <input
                    type="text"
                    value={formData.gps_latitude}
                    onChange={(e) => setFormData({...formData, gps_latitude: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Auto-detected"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPS Longitude</label>
                  <input
                    type="text"
                    value={formData.gps_longitude}
                    onChange={(e) => setFormData({...formData, gps_longitude: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Auto-detected"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photos (up to 3)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  onChange={(e) => {
                    const files = Array.from(e.target.files).slice(0, 3);
                    setFormData({...formData, photos: files});
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Maximum 3 photos</p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 font-medium"
              >
                {submitting ? 'Saving...' : 'Save Incident'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Incident app error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<IncidentApp />);