function Alert({ type, message, onClose }) {
  try {
    const bgColors = {
      success: 'bg-green-50 border-green-200',
      error: 'bg-red-50 border-red-200',
      warning: 'bg-yellow-50 border-yellow-200',
      info: 'bg-blue-50 border-blue-200'
    };

    const textColors = {
      success: 'text-green-800',
      error: 'text-red-800',
      warning: 'text-yellow-800',
      info: 'text-blue-800'
    };

    const icons = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'info'
    };

    return (
      <div className={`${bgColors[type]} border rounded-lg p-4 mb-4 flex items-start gap-3`} data-name="alert" data-file="components/Alert.js">
        <div className={`icon-${icons[type]} text-lg ${textColors[type]}`}></div>
        <div className="flex-1">
          <p className={`${textColors[type]} text-sm font-medium`}>{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className={`${textColors[type]} hover:opacity-70`}>
            <div className="icon-x text-lg"></div>
          </button>
        )}
      </div>
    );
  } catch (error) {
    console.error('Alert component error:', error);
    return null;
  }
}