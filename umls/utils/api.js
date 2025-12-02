const BASE_URL = 'https://kimawasco.utilitymis.com/kimapi';
const PROXY_URL = 'https://proxy-api.trickle-app.host/?url=';

/**
 * Generic API request
 * opts: { useProxy: boolean (default true), contentType: 'json'|'form' (default 'json') }
 */
async function apiRequest(endpoint, data = {}, token = null, opts = { useProxy: true, contentType: 'json' }) {
  try {
    const { useProxy = true, contentType = 'json' } = opts;
    const requestData = { ...data };

    if (token) requestData.trongate_token = token;

    const targetUrl = `${BASE_URL}${endpoint}`;
    const url = useProxy ? `${PROXY_URL}${encodeURIComponent(targetUrl)}` : targetUrl;

    console.log('API Request:', {
      endpoint,
      hasToken: !!token,
      targetUrl,
      useProxy,
      contentType,
      requestData: { ...requestData, trongate_token: token ? '***' : undefined }
    });

    let headers = { 'Accept': 'application/json' };
    let body;

    if (contentType === 'form') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      const form = new URLSearchParams();
      Object.keys(requestData).forEach(key => {
        const val = requestData[key];
        if (Array.isArray(val) || (val !== null && typeof val === 'object')) {
          form.append(key, JSON.stringify(val));
        } else if (val !== undefined) {
          form.append(key, String(val));
        }
      });
      body = form.toString();
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(requestData);
    }

    const response = await fetch(url, { method: 'POST', headers, body });
    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    let responseData;
    if (!responseText) {
      responseData = {};
    } else {
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.warn('Response not JSON for', endpoint, 'raw:', responseText);
        responseData = { _raw: responseText };
      }
    }

    console.log('Parsed API Response:', { status: response.status, ok: response.ok, data: responseData });

    if (!response.ok) {
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        endpoint,
        requestData: { ...requestData, trongate_token: token ? '***' : undefined },
        response: responseData
      });
      throw new Error(`HTTP ${response.status}: ${responseData._raw || JSON.stringify(responseData)}`);
    }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// --- API Wrappers ---

async function loginUser(username, password) {
  const result = await apiRequest('/gateman/login', { username, password });
  console.log('Login result:', result);

  if (result && result.trongate_token) {
    return {
      success: true,
      data: {
        user_id: result.user_id,
        trongate_user_id: result.trongate_user_id,
        trongate_token: result.trongate_token,
        user_name: result.username || result.user_name,
        employee_name: result.employee_name,
        user_role_id: result.user_role_id
      }
    };
  } else {
    return { success: false, error: 'Invalid response from server.' };
  }
}

// keep apiRequest as-is (it supports opts: { useProxy, contentType } per our rewrite)

async function fetchServiceAreas(userId, token) {
  const result = await apiRequest('/api_get/get_service_areas', { user_id: userId }, token, { useProxy: true, contentType: 'form' });
  console.log('Service areas result:', result);
  return result.service_areas || [];
}

async function fetchServiceZones(parentId, token) {
  const result = await apiRequest('/api_get/get_service_zones', { parent_id: parentId }, token, { useProxy: true, contentType: 'form' });
  console.log('Service zones result:', result);
  return result.service_zones || [];
}

async function fetchMeterBooks(zoneIds, token) {
  if (!Array.isArray(zoneIds) || zoneIds.length === 0) throw new Error('Zone IDs are required');
  const result = await apiRequest('/api_get/get_meter_books', { zone_ids: zoneIds }, token, { useProxy: true, contentType: 'form' });
  console.log('Meter books result:', result);
  return result.meter_books || [];
}
// Fetch sheets assigned to a user (matches your Postman screenshot)
async function fetchAssignedSheets(userId, token) {
  if (!userId) throw new Error('userId is required to fetch assigned sheets');
  // use proxy + form encoding (consistent with other endpoints)
  const result = await apiRequest('/meter_reader/get_assigned_sheets', { user_id: userId }, token, { useProxy: true, contentType: 'form' });
  console.log('Assigned meter sheets result:', result);
  return result.meter_sheets || [];
}

// Alternative: fetch meter sheets by book IDs (if you ever need this endpoint)
async function fetchMeterSheetsByBookIds(bookIds, token) {
  if (!Array.isArray(bookIds) || bookIds.length === 0) throw new Error('bookIds are required');
  const result = await apiRequest('/api_get/get_meter_sheets', { book_ids: bookIds }, token, { useProxy: true, contentType: 'form' });
  console.log('Meter sheets by book_ids result:', result);
  return result.meter_sheets || [];
}


// --- Other API endpoints using default JSON+proxy ---

async function fetchTaskTypes(token) { return apiRequest('/technician/get_task_types', {}, token); }
async function fetchTaskActions(token) { return apiRequest('/technician/get_task_actions', {}, token); }
async function fetchMyTasks(userId, token) { return apiRequest('/technician/get_my_tasks', { user_id: userId }, token); }
async function fetchAccountTypes(token) { return apiRequest('/api_get/get_account_types', {}, token); }
async function fetchTariffChargeCategories(token) { return apiRequest('/api_get/get_tariff_charge_categories', {}, token); }
async function fetchMaterialPipelines(token) { return apiRequest('/api_get/get_material_pipelines', {}, token); }
async function fetchMeterSizes(token) { return apiRequest('/api_get/get_meter_sizes', {}, token); }
async function fetchTariffCategories(token) { return apiRequest('/api_get/get_tariff_categories', {}, token); }
async function searchCustomer(searchTerm, token) { return apiRequest('/api_get/search_customer', { search_term: searchTerm }, token); }
async function uploadTaskData(taskData, token) { return apiRequest('/technician/upload_task', taskData, token); }
async function uploadTaskImages(images, token) { return apiRequest('/technician/upload_task_images', { images }, token); }
async function reportIncident(incidentData, token) { return apiRequest('/technician/report_incident', incidentData, token); }
