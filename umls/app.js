class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [alert, setAlert] = React.useState(null);

    React.useEffect(() => {
      const session = getSession();
      if (session) {
        window.location.href = 'dashboard.html';
      }
    }, []);

    const handleLogin = async (e) => {
      e.preventDefault();
      if (!username || !password) {
        setAlert({ type: 'error', message: 'Please enter username and password' });
        return;
      }

      setLoading(true);
      setAlert(null);

      try {
        console.log('Attempting login with username:', username);
        const result = await loginUser(username, password);
        
        console.log('Login result received:', result);
        
        if (result.success && result.data) {
          console.log('Login successful, saving session...');
          saveSession(result.data);
          console.log('Session saved, redirecting to dashboard...');
          window.location.href = 'dashboard.html';
        } else {
          console.error('Login failed:', result.error);
          setAlert({ type: 'error', message: result.error || 'Invalid credentials. Please try again.' });
        }
      } catch (error) {
        console.error('Login exception:', error);
        setAlert({ type: 'error', message: 'Connection error. Please check your internet connection.' });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-name="login-page" data-file="app.js">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--primary-color)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="icon-droplets text-3xl text-white"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Utility Management</h1>
            <p className="text-gray-600 mt-2">Sign in to access your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary py-3 text-lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            © 2025 Utility Management System
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);