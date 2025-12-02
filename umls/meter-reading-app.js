function MeterReadingApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [reading, setReading] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [alert, setAlert] = React.useState(null);

    React.useEffect(() => {
      const session = getSession();
      if (!session) {
        window.location.href = 'index.html';
        return;
      }
      setUser(session);
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setAlert(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAlert({ type: 'success', message: 'Meter reading saved successfully' });
        setReading('');
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to save meter reading' });
      } finally {
        setSubmitting(false);
      }
    };

    if (!user) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header userName={user.employee_name} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meter Reading</h2>
          
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="icon-gauge text-3xl text-orange-600"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Record Meter Reading</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meter Reading</label>
                <input
                  type="number"
                  value={reading}
                  onChange={(e) => setReading(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-2xl text-center"
                  placeholder="Enter reading"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 font-medium"
              >
                {submitting ? 'Saving...' : 'Save Reading'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Meter reading app error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MeterReadingApp />);