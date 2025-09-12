# Navigation System Documentation

## Overview
This project implements a role-based navigation system with separate menus for Admin and User roles.

## Components

### SideMenu (`/components/molecules/Navigation/SideMenu.tsx`)
- Role-based navigation drawer
- Displays different menu items based on user role
- Includes user info and logout functionality

### NavBar (`/components/molecules/Navigation/NavBar.tsx`)
- Top navigation bar with menu toggle
- User profile dropdown
- Notification icon (placeholder)

### MainLayout (`/components/molecules/Navigation/MainLayout.tsx`)
- Main layout wrapper that includes NavBar
- Provides consistent layout for all pages

### ReduxRoleGuard (`/components/Auth/ReduxRoleGuard.tsx`)
- Route protection based on user roles
- Redirects unauthorized users
- Works with Redux auth state

## Role-Based Routes

### Admin Routes
- **Dashboard** (`/dashboard`) - Analytics and overview (default)
- **Add Survey** (`/addSurvey`) - Create new surveys
- **Response List** (`/responses`) - View all user responses

### User Routes
- **Surveys** (`/surveys`) - Browse available surveys (default)
- **My Responses** (`/my-responses`) - View personal response history
- **Add Response** (`/add-response`) - Take surveys

## Usage

### Implementing Navigation
```tsx
import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";

const MyPage = () => {
  return (
    <ReduxRoleGuard allowedRoles={["Admin", "User"]}>
      <MainLayout>
        {/* Your page content */}
      </MainLayout>
    </ReduxRoleGuard>
  );
};
```

### Menu Configuration
Menu items are configured in the `menuItems` array in `SideMenu.tsx`:

```tsx
const menuItems: MenuItem[] = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: ["Admin"],
  },
  // ... more items
];
```

## Features

- **Responsive Design**: Works on both desktop and mobile
- **Role-Based Access**: Different navigation based on user role
- **Route Protection**: Automatic redirection for unauthorized access
- **User Info Display**: Shows current user email and role
- **Logout Functionality**: Available from both sidebar and navbar
- **Material-UI Integration**: Consistent with Material-UI design system

## Customization

To add new menu items:
1. Add the route to the `menuItems` array in `SideMenu.tsx`
2. Specify the allowed roles
3. Create the corresponding page component
4. Add route protection using `ReduxRoleGuard`

To modify the layout:
1. Update `MainLayout.tsx` for overall page structure
2. Update `NavBar.tsx` for header modifications
3. Update `SideMenu.tsx` for sidebar changes
