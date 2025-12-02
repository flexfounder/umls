const SESSION_KEY = 'ums_session';
const SYNC_DATA_KEY = 'ums_sync_data';

function saveSession(data) {
  try {
    const sessionData = {
      user_id: data.user_id,
      trongate_user_id: data.trongate_user_id,
      trongate_token: data.trongate_token,
      user_name: data.user_name || data.username,
      employee_name: data.employee_name,
      user_role_id: data.user_role_id
    };
    console.log('Saving session with token:', sessionData.trongate_token ? 'Present' : 'Missing');
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

function getSession() {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

function saveSyncData(key, data) {
  try {
    const syncData = getSyncData() || {};

    // Normalize based on API result structure
    let normalized;

    if (Array.isArray(data)) {
      // If API returned an array directly
      normalized = data;

    } else if (data && typeof data === 'object') {
      // Try to detect the correct key e.g. service_zones, meter_books, etc.
      const innerKey = Object.keys(data).find(k => Array.isArray(data[k]));

      if (innerKey) {
        normalized = data[innerKey];   // extract the real array
      } else {
        normalized = data; // Fallback (rare)
      }

    } else {
      normalized = data;
    }

    syncData[key] = normalized;
    syncData.lastSync = new Date().toISOString();

    localStorage.setItem(SYNC_DATA_KEY, JSON.stringify(syncData));
    console.log(`Saved normalized sync data for ${key}:`, normalized);

  } catch (error) {
    console.error('Error saving sync data:', error);
  }
}


function getSyncData() {
  try {
    const data = localStorage.getItem(SYNC_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting sync data:', error);
    return null;
  }
}

function saveLocalTask(taskData) {
  try {
    const tasks = getLocalTasks();
    tasks.push({ ...taskData, id: Date.now(), saved_at: new Date().toISOString() });
    localStorage.setItem('local_tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving local task:', error);
  }
}

function getLocalTasks() {
  try {
    const data = localStorage.getItem('local_tasks');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting local tasks:', error);
    return [];
  }
}

function clearLocalTasks() {
  try {
    localStorage.removeItem('local_tasks');
  } catch (error) {
    console.error('Error clearing local tasks:', error);
  }
}
