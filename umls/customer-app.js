function CustomerApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searching, setSearching] = React.useState(false);
    const [customers, setCustomers] = React.useState([]);
    const [alert, setAlert] = React.useState(null);

    React.useEffect(() => {
      const session = getSession();
      if (!session) {
        window.location.href = 'index.html';
        return;
      }
      setUser(session);
    }, []);

    const handleSearch = async (e) => {
      e.preventDefault();
      if (!searchTerm.trim()) return;

      setSearching(true);
      setAlert(null);

      try {
        const data = await searchCustomer(searchTerm, user.trongate_token);
        setCustomers(data || []);
        if (!data || data.length === 0) {
          setAlert({ type: 'info', message: 'No customers found' });
        }
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to search customers' });
      } finally {
        setSearching(false);
      }
    };

    if (!user) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header userName={user.employee_name} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Search</h2>
          
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="Search by name, account number, or meter number"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-300"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {customers.map((customer, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{customer.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Account: {customer.account_number}</p>
                  <p>Meter: {customer.meter_number}</p>
                  <p>Address: {customer.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Customer app error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CustomerApp />);