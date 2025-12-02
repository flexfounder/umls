function SyncCard({ item, syncing, lastSync, onSync }) {
  try {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className={`icon-${item.icon} text-xl text-blue-600`}></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              {lastSync && (
                <p className="text-sm text-gray-500">
                  Last synced: {new Date(lastSync).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onSync}
            disabled={syncing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2"
          >
            {syncing ? (
              <>
                <div className="icon-loader-2 text-lg animate-spin"></div>
                Syncing...
              </>
            ) : (
              <>
                <div className="icon-refresh-cw text-lg"></div>
                Sync
              </>
            )}
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SyncCard error:', error);
    return null;
  }
}