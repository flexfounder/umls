function MeterSheetsApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [sheets, setSheets] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const session = getSession();
      if (!session) {
        window.location.href = 'index.html';
        return;
      }
      setUser(session);
      loadSheets();
    }, []);

    const loadSheets = () => {
      const syncData = getSyncData();
      if (syncData && syncData.meter_sheets) {
        setSheets(syncData.meter_sheets);
      }
      setLoading(false);
    };

    const handleSheetClick = (sheet) => {
      const isExpired = new Date(sheet.due_date) < new Date();
      if (!isExpired) {
        window.location.href = `meter-accounts.html?sheet=${sheet.id}`;
      }
    };

    if (!user) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header userName={user.employee_name} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meter Sheets</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="icon-loader-2 text-3xl text-orange-600 animate-spin mx-auto"></div>
            </div>
          ) : sheets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No meter sheets available. Please sync data first.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sheets.map(sheet => (
                <MeterSheetCard
                  key={sheet.id}
                  sheet={sheet}
                  onClick={() => handleSheetClick(sheet)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Meter sheets app error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MeterSheetsApp />);