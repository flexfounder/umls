function SyncApp() {
  const [user, setUser] = React.useState(null);
  const [syncing, setSyncing] = React.useState({});
  const [alert, setAlert] = React.useState(null);
  const [syncStatus, setSyncStatus] = React.useState({});

  // ---------- Helpers ----------
  // Extract the likely resource array from an API response object
  function extractArrayFromResponse(itemId, data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    // If there's a direct key matching the itemId (service_zones, meter_books)
    if (data[itemId] && Array.isArray(data[itemId])) return data[itemId];

    // Try common pluralizations or fallback to first array value
    for (const k of Object.keys(data)) {
      if (Array.isArray(data[k])) return data[k];
    }

    return [];
  }

  // Flatten one level and remove falsy items
  function normalizeArray(arr) {
    if (!Array.isArray(arr)) return [];
    const flattened = [].concat(...arr.map(x => (Array.isArray(x) ? x : [x])));
    return flattened.filter(Boolean);
  }

  React.useEffect(() => {
    const session = getSession();
    if (!session) {
      window.location.href = 'index.html';
      return;
    }
    setUser(session);
    loadSyncStatus();
  }, []);

  const loadSyncStatus = () => {
    const data = getSyncData();
    if (data) setSyncStatus(data);
  };

  const syncItems = [
    { id: 'service_areas', title: 'Service Areas', icon: 'map-pin' },
    { id: 'service_zones', title: 'Service Zones', icon: 'map' },
    { id: 'meter_books', title: 'Meter Books', icon: 'book' },
    { id: 'meter_sheets', title: 'Meter Sheets', icon: 'file-text' },
    { id: 'pipeline_materials', title: 'Pipeline Materials', icon: 'package' },
    { id: 'pipeline_sizes', title: 'Pipeline Sizes', icon: 'ruler' },
    { id: 'task_types', title: 'Task Types', icon: 'list' },
    { id: 'task_actions', title: 'Task Actions', icon: 'zap' }
  ];

  const handleSync = async (item) => {
    setSyncing(prev => ({ ...prev, [item.id]: true }));
    setAlert(null);

    try {
      let rawData;
      console.log('Starting sync for:', item.id);
      console.log('User session:', {
        user_id: user.user_id,
        has_token: !!user.trongate_token,
        token_preview: user.trongate_token ? user.trongate_token.substring(0, 10) + '...' : 'none'
      });

      switch (item.id) {
        case 'service_areas': {
          // API wrapper might return object or array; normalize before saving
          rawData = await fetchServiceAreas(user.user_id, user.trongate_token);
          console.log('Raw service_areas response:', rawData);
          const extracted = extractArrayFromResponse('service_areas', rawData);
          const toSave = normalizeArray(extracted);
          console.log('Normalized payload to save for service_areas:', toSave);
          saveSyncData('service_areas', toSave);
          break;
        }

        case 'service_zones': {
          // Must fetch zones for each service area (parent_id = service_area.id)
          const serviceAreas = getSyncData()?.service_areas || [];
          if (!serviceAreas || serviceAreas.length === 0) {
            throw new Error('Please sync Service Areas first before syncing Service Zones');
          }

          const combined = [];
          for (const area of serviceAreas) {
            // fetchServiceZones may return an array or an object with service_zones
            const zoneRaw = await fetchServiceZones(area.id, user.trongate_token);
            console.log(`Raw zones response for parent_id=${area.id}:`, zoneRaw);
            const extracted = extractArrayFromResponse('service_zones', zoneRaw);
            const normalized = normalizeArray(extracted);
            combined.push(...normalized);
          }

          // Deduplicate by id (defensive)
          const uniqueById = [];
          const seen = new Set();
          for (const z of combined) {
            const id = z.id || z.zone_id || JSON.stringify(z);
            if (!seen.has(id)) {
              seen.add(id);
              uniqueById.push(z);
            }
          }

          console.log('Normalized payload to save for service_zones:', uniqueById);
          saveSyncData('service_zones', uniqueById);
          break;
        }

        case 'meter_books': {
          // Ensure service zones are available
          const syncData = getSyncData();
          const serviceZones = syncData?.service_zones || [];
          const zoneIds = serviceZones.map(z => z.id || z.zone_id).filter(Boolean);

          if (zoneIds.length === 0) {
            throw new Error('Please sync Service Zones first before syncing Meter Books');
          }

          console.log('Using zone IDs for meter books:', zoneIds);
          rawData = await fetchMeterBooks(zoneIds, user.trongate_token);
          console.log('Raw meter_books response:', rawData);
          const extracted = extractArrayFromResponse('meter_books', rawData);
          const toSave = normalizeArray(extracted);
          console.log('Normalized payload to save for meter_books:', toSave);
          saveSyncData('meter_books', toSave);
          break;
        }

        case 'meter_sheets': {
  // Use assigned-sheets endpoint (user_id) — matches your screenshot
  const syncData = getSyncData();

  // Option A: fetch sheets assigned to the logged-in user
  const bookAssignedSheets = await fetchAssignedSheets(user.user_id, user.trongate_token);
  console.log('Raw meter_sheets response (assigned):', bookAssignedSheets);
  // normalize and save
  const extracted = extractArrayFromResponse('meter_sheets', { meter_sheets: bookAssignedSheets });
  const toSave = normalizeArray(extracted);
  console.log('Normalized payload to save for meter_sheets:', toSave);
  saveSyncData('meter_sheets', toSave);
  break;

  /* --- If you prefer to fetch by book IDs instead, use this alternative:
  const syncData = getSyncData();
  const meterBooks = syncData?.meter_books || [];
  const bookIds = meterBooks.map(b => b.id).filter(Boolean);
  if (bookIds.length === 0) throw new Error('Please sync Meter Books first before syncing Meter Sheets');

  const rawData = await fetchMeterSheetsByBookIds(bookIds, user.trongate_token);
  const extracted = extractArrayFromResponse('meter_sheets', rawData);
  const toSave = normalizeArray(extracted);
  saveSyncData('meter_sheets', toSave);
  break;
  */
}



        case 'pipeline_materials': {
          rawData = await fetchMaterialPipelines(user.trongate_token);
          const extracted = extractArrayFromResponse('pipeline_materials', rawData);
          const toSave = normalizeArray(extracted);
          saveSyncData('pipeline_materials', toSave);
          break;
        }

        case 'pipeline_sizes': {
          rawData = await fetchMeterSizes(user.trongate_token);
          const extracted = extractArrayFromResponse('pipeline_sizes', rawData);
          const toSave = normalizeArray(extracted);
          saveSyncData('pipeline_sizes', toSave);
          break;
        }

        case 'task_types': {
          rawData = await fetchTaskTypes(user.trongate_token);
          const extracted = extractArrayFromResponse('task_types', rawData);
          const toSave = normalizeArray(extracted);
          saveSyncData('task_types', toSave);
          break;
        }

        case 'task_actions': {
          rawData = await fetchTaskActions(user.trongate_token);
          const extracted = extractArrayFromResponse('task_actions', rawData);
          const toSave = normalizeArray(extracted);
          saveSyncData('task_actions', toSave);
          break;
        }

        default:
          throw new Error('Unknown sync item');
      }

      console.log('Sync data received for', item.id, ':', rawData);
      loadSyncStatus();
      setAlert({ type: 'success', message: `${item.title} synced successfully` });

    } catch (error) {
      console.error('Sync error for', item.id, ':', error);
      let errorMsg;
      if (error.message && error.message.includes('401')) {
        errorMsg = 'Session expired. Please login again.';
        setTimeout(() => {
          clearSession();
          window.location.href = 'index.html';
        }, 2000);
      } else {
        errorMsg = `Failed to sync ${item.title}. ${error.message || error}`;
      }
      setAlert({ type: 'error', message: errorMsg });
    } finally {
      setSyncing(prev => ({ ...prev, [item.id]: false }));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={user.employee_name} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Data Sync</h2>
          <p className="text-gray-600 mt-1">Synchronize master data from server</p>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <div className="space-y-4">
          {syncItems.map(item => (
            <SyncCard
              key={item.id}
              item={item}
              syncing={syncing[item.id]}
              lastSync={syncStatus[item.id] ? syncStatus.lastSync : null}
              onSync={() => handleSync(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SyncApp />);

