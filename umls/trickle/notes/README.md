# Utility Management System - Web Application

## Overview
A comprehensive web-based utility management system for field operations, meter reading, task management, customer service, and incident reporting with offline support.

## Core Features

### 1. Authentication
- Secure login via `/gateman/login`
- Local session storage with token-based auth
- Stores: user_id, trongate_user_id, trongate_token, user_name, employee_name, user_role_id

### 2. Dashboard
8-module grid navigation:
- Sync (data synchronization)
- View Tasks (task categories)
- Upload Tasks (two-phase upload)
- Report Incident (offline capable)
- Read Meter (sheet-based workflow)
- Customer (live search)
- Settings (configuration)
- Logout

### 3. Sync Module
Fetches and stores master data:
- Service Areas → Service Zones → Meter Books → Meter Sheets
- Pipeline Materials & Sizes
- Task Types & Actions
- Account Types & Tariff Categories

### 4. Task Management
- View task categories (from synced data)
- Shows assigned/completed counts per category
- Task detail forms with notes and images
- Offline storage until upload

### 5. Meter Reading
- Shows assigned meter sheets for active cycle
- Displays pending/completed counts
- Disables expired sheets (past due date)
- Account list with tabs: Pending/Done/All
- Detail screen with forms, notes, photos

### 6. Incident Reporting
- Form fields: incident_type, description, GPS coordinates
- Auto-detects GPS location
- Supports up to 3 photos
- Offline-capable with local storage

### 7. Upload Module
Two-phase upload process:
- Phase 1: Upload task data
- Phase 2: Upload images
- Progress tracking with percentage
- Success state display

### 8. Customer Module
- Live search by account/meter/phone
- Display customer details
- Shows name, status, balance info

### 9. Settings
- API endpoint configuration
- Sync frequency options
- Clear cache functionality
- App version & contact info

## Technology Stack
- React 18 (production CDN)
- TailwindCSS for styling
- Lucide Icons (static font)
- LocalStorage for offline data
- Proxy API for CORS handling

## API Integration
**Base URL**: `https://kimawasco.utilitymis.com/kimapi/`

All requests require `trongate_token` in headers.

### Endpoints:
- `/gateman/login` - Authentication
- `/api_get/get_service_areas` - Service areas
- `/api_get/get_service_zones` - Service zones
- `/api_get/get_meter_books` - Meter books
- `/api_get/get_meter_sheets` - Meter sheets
- `/api_get/get_account_types` - Account types
- `/api_get/get_tariff_charge_categories` - Tariff categories
- `/api_get/get_material_pipelines` - Pipeline materials
- `/api_get/get_meter_sizes` - Meter/pipeline sizes
- `/api_get/get_tariff_categories` - Tariff categories
- `/technician/get_task_types` - Task types
- `/technician/get_task_actions` - Task actions
- `/technician/get_my_tasks` - User tasks
- `/technician/upload_task` - Upload task data
- `/technician/upload_task_images` - Upload images
- `/technician/report_incident` - Report incidents
- `/api_get/search_customer` - Customer search

## Project Structure
```
├── index.html                  # Login page
├── dashboard.html              # Main dashboard
├── sync.html                   # Data sync page
├── task-categories.html        # Task categories list
├── meter-sheets.html           # Meter sheets list
├── upload.html                 # Task upload page
├── incident.html               # Incident reporting
├── customer.html               # Customer search
├── settings.html               # App settings
├── app.js                      # Login logic
├── dashboard-app.js            # Dashboard logic
├── sync-app.js                 # Sync logic
├── task-categories-app.js      # Task categories logic
├── meter-sheets-app.js         # Meter sheets logic
├── upload-app.js               # Upload logic
├── incident-app.js             # Incident logic
├── customer-app.js             # Customer logic
├── settings-app.js             # Settings logic
├── components/
│   ├── Alert.js               # Alert component
│   ├── Header.js              # Header component
│   ├── DashboardCard.js       # Dashboard card
│   ├── SyncCard.js            # Sync item card
│   ├── TaskCategoryCard.js    # Task category card
│   └── MeterSheetCard.js      # Meter sheet card
└── utils/
    ├── storage.js             # LocalStorage utilities
    └── api.js                 # API functions
```

## Data Flow
1. Login → Store session
2. Sync → Fetch master data → Store locally
3. Tasks → Load from sync data → Work offline → Upload when ready
4. Meter Reading → Load sheets → Record readings → Upload
5. Incidents → Report offline → Upload when online

## Offline Capabilities
- Master data cached in LocalStorage
- Tasks saved locally until uploaded
- Incidents stored offline
- Upload queue management

Last Updated: 2025-11-30
