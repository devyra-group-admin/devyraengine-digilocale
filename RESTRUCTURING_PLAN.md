# Dullstroom Digital - Restructuring Plan

## Current Structure (Type-based - NOT scalable)

```
src/
├── components/        # All components mixed together
├── data/             # All data mixed together
├── App.jsx
└── main.jsx
```

## New Structure (Feature-based - BEST PRACTICE)

```
src/
├── features/                    # Feature modules
│   ├── admin/
│   │   ├── components/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   └── BusinessManagement.jsx
│   │   ├── hooks/
│   │   │   └── useAdminData.js
│   │   └── constants/
│   │       └── adminConstants.js
│   │
│   ├── businesses/
│   │   ├── components/
│   │   │   ├── BusinessesSection.jsx
│   │   │   ├── BusinessList.jsx
│   │   │   └── BusinessDetails.jsx
│   │   ├── data/
│   │   │   └── mockBusinesses.js
│   │   └── hooks/
│   │       └── useBusinesses.js
│   │
│   ├── bookings/
│   │   ├── components/
│   │   │   ├── BookingsSection.jsx
│   │   │   ├── AccommodationList.jsx
│   │   │   ├── AccommodationDetails.jsx
│   │   │   └── BookingEnquiryModal.jsx
│   │   ├── data/
│   │   │   └── mockAccommodations.js
│   │   └── hooks/
│   │       └── useBookings.js
│   │
│   └── community/
│       ├── components/
│       │   ├── CommunitySection.jsx
│       │   ├── BoardList.jsx
│       │   └── PostCard.jsx
│       ├── data/
│       │   └── mockPosts.js
│       └── hooks/
│           └── useCommunity.js
│
├── shared/                      # Shared/reusable code
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapComponent.jsx
│   │   │   └── MapMarker.jsx
│   │   ├── UI/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── SearchBar.jsx
│   │   └── Layout/
│   │       ├── Header.jsx
│   │       ├── Sidebar.jsx
│   │       └── Footer.jsx
│   │
│   ├── hooks/
│   │   ├── useSearch.js
│   │   ├── useMap.js
│   │   └── useAuth.js
│   │
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── helpers.js
│   │
│   └── constants/
│       ├── routes.js
│       ├── colors.js
│       └── config.js
│
├── services/                    # API & external services
│   ├── api/
│   │   ├── client.js
│   │   ├── businesses.js
│   │   ├── bookings.js
│   │   └── users.js
│   │
│   └── auth/
│       └── authService.js
│
├── context/                     # Global state
│   ├── AuthContext.jsx
│   └── AppContext.jsx
│
├── layouts/                     # Page layouts
│   ├── MainLayout.jsx
│   └── AdminLayout.jsx
│
├── App.jsx                      # Main app component
├── main.jsx                     # Entry point
└── index.css                    # Global styles
```

## Benefits of This Structure

### 1. **Feature-Based Organization**

- Each feature is self-contained
- Easy to find related code
- Can be developed independently
- Clear ownership and responsibility

### 2. **Scalability**

- Add new features without touching existing ones
- Easy to extract features into separate packages
- Team members can work on different features without conflicts

### 3. **Maintainability**

- Related code is co-located
- Clear separation of concerns
- Easier to understand and modify

### 4. **Reusability**

- Shared components in one place
- Common hooks easily accessible
- Utilities centralized

### 5. **Testability**

- Each feature can be tested independently
- Mocking is easier with service layer
- Clear boundaries for unit tests

## Implementation Steps

1. ✅ Create new folder structure
2. ✅ Move components to features
3. ✅ Extract shared components
4. ✅ Create custom hooks
5. ✅ Setup services layer
6. ✅ Update imports
7. ✅ Test build

## Folder Naming Conventions

- **features/** - PascalCase (e.g., `Admin`, `Bookings`)
- **components/** - Always lowercase
- **files** - PascalCase for components, camelCase for utilities
- **constants** - UPPER_CASE for exports

## File Naming Conventions

- Components: `ComponentName.jsx`
- Hooks: `useHookName.js`
- Utils: `utilityName.js`
- Constants: `constantsName.js`
- Services: `serviceName.js`

## Import Path Aliases (to configure)

```javascript
// Instead of:
import Map from "../../../shared/components/Map/MapComponent";

// Use:
import Map from "@/shared/components/Map/MapComponent";
import { useAuth } from "@/shared/hooks/useAuth";
import { apiClient } from "@/services/api/client";
```

This makes imports cleaner and easier to refactor.
