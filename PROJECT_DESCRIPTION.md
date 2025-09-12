# Survey Management System - Complete Project Documentation

## 📋 Project Overview

A full-stack Survey Management System built with **Next.js 14**, **TypeScript**, **Material-UI**, **MongoDB**, and **Redux Toolkit**. The application allows administrators to create and manage surveys while enabling users to participate in surveys and track their responses.

## 🚀 Key Features

### **Authentication & Authorization**
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** (Admin/User roles)
- **Protected Routes** with Redux role guards
- **Secure Password Handling** with validation
- **Auto-logout** functionality

### **Admin Dashboard**
- **Analytics Dashboard** with date range filtering
- **Real-time Charts** using ApexCharts (surveys and responses over time)
- **Statistics Cards** showing total surveys, responses, and users
- **Date Range Picker** with Popper component for better UX
- **Responsive Design** with Material-UI components

### **Survey Management**
- **Create Surveys** with dynamic form fields
- **Question Types**: Text, Number, Radio, Checkbox, Select dropdown
- **Survey Activation/Deactivation** toggle functionality
- **Survey Listing** with grid layout
- **Survey Details** view with full question breakdown

### **Response Management**
- **Submit Responses** to active surveys
- **Response Validation** with proper error handling
- **Response History** for users
- **Admin Response Overview** with detailed analytics
- **Response Details** view with complete submission data

### **User Profile Management**
- **Profile View** with user information display
- **Edit Profile** functionality with form validation
- **Role-based UI** showing different options for Admin/User
- **Profile Picture Avatar** with initials fallback
- **Account Information** panel

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Material-UI (MUI)** - React component library
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling with validation
- **Yup** - Schema validation
- **ApexCharts** - Interactive charts and graphs
- **React Date Range** - Date range picker component
- **React Toastify** - Toast notifications
- **Axios** - HTTP client for API calls

### **Backend**
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **UUID** - Unique identifier generation

### **Development Tools**
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **VS Code** - Development environment

## 📁 Project Structure

```
next-app/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── addSurvey/           # Survey creation API
│   │   │   ├── dashboard/           # Dashboard analytics API
│   │   │   ├── login/               # Authentication API
│   │   │   ├── profile/             # User profile API
│   │   │   ├── register/            # User registration API
│   │   │   ├── responses/           # Response management API
│   │   │   └── surveys/             # Survey management API
│   │   ├── redux/                   # Redux state management
│   │   │   ├── slices/              # Redux slices
│   │   │   │   ├── authSlice.ts     # Authentication state
│   │   │   │   ├── surveySlice.ts   # Survey management state
│   │   │   │   ├── responseSlice.ts # Response management state
│   │   │   │   ├── profileSlice.ts  # Profile management state
│   │   │   │   └── analyticsSlice.ts # Analytics state
│   │   │   ├── selector/            # Redux selectors
│   │   │   ├── store.ts             # Redux store configuration
│   │   │   └── rootReducer.ts       # Root reducer
│   │   ├── [pages]/                 # Application pages
│   │   │   ├── dashboard/           # Admin dashboard
│   │   │   ├── surveys/             # Survey listing
│   │   │   ├── addSurvey/           # Survey creation
│   │   │   ├── responses/           # Response management
│   │   │   ├── my-responses/        # User responses
│   │   │   ├── add-response/        # Response submission
│   │   │   ├── profile/             # User profile
│   │   │   ├── login/               # Login page
│   │   │   └── register/            # Registration page
│   │   └── globals.css              # Global styles
│   ├── Backend/                     # Backend logic
│   │   ├── config/                  # Configuration files
│   │   │   └── dataBase.ts          # MongoDB connection
│   │   ├── controller/              # API controllers
│   │   │   ├── LoginController.ts   # Login logic
│   │   │   ├── RegisterController.ts # Registration logic
│   │   │   ├── SurveyController.ts  # Survey CRUD operations
│   │   │   ├── ResponseController.ts # Response CRUD operations
│   │   │   └── UserController.ts    # User management
│   │   ├── model/                   # Database models
│   │   │   ├── UserModel.ts         # User schema
│   │   │   ├── SurveyModel.ts       # Survey schema
│   │   │   └── ResponseModel.ts     # Response schema
│   │   ├── services/                # Business logic services
│   │   │   ├── Analytics.ts         # Analytics calculations
│   │   │   ├── LoginService.ts      # Login service
│   │   │   ├── RegisterService.ts   # Registration service
│   │   │   ├── SurveyService.ts     # Survey service
│   │   │   ├── ResponseService.ts   # Response service
│   │   │   └── UserService.ts       # User service
│   │   ├── types/                   # TypeScript type definitions
│   │   ├── utils/                   # Utility functions
│   │   │   ├── JwtToken.ts          # JWT token utilities
│   │   │   ├── responseHandler.ts   # API response formatting
│   │   │   ├── translate.ts         # Translation utilities
│   │   │   └── Validation.ts        # Validation helpers
│   │   └── validations/             # Input validation schemas
│   ├── components/                  # React components
│   │   ├── Atoms/                   # Small reusable components
│   │   ├── Auth/                    # Authentication components
│   │   │   ├── AuthProvider.tsx     # Auth context provider
│   │   │   ├── RoleGuard.tsx        # Route protection
│   │   │   └── ReduxRoleGuard.tsx   # Redux-based route protection
│   │   ├── molecules/               # Composite components
│   │   │   ├── Navigation/          # Navigation components
│   │   │   │   ├── NavBar.tsx       # Top navigation bar
│   │   │   │   ├── SideMenu.tsx     # Sidebar navigation
│   │   │   │   └── MainLayout.tsx   # Main layout wrapper
│   │   │   ├── Dashboard/           # Dashboard components
│   │   │   │   └── Dashboard.tsx    # Analytics dashboard
│   │   │   ├── Surveys/             # Survey components
│   │   │   │   └── SurveyCard.tsx   # Survey list cards
│   │   │   └── Response/            # Response components
│   │   │       └── AddResponse.tsx  # Response form
│   │   └── Icons/                   # Custom icon components
│   ├── shared/                      # Shared utilities
│   │   └── Hook-form/               # Custom hooks
│   │       ├── FormProvider.tsx     # Form context provider
│   │       └── useAnalytics.ts      # Analytics hook
│   ├── types/                       # Global TypeScript types
│   │   ├── Analytics.ts             # Analytics type definitions
│   │   └── Survey.ts                # Survey type definitions
│   ├── locales/                     # Internationalization
│   │   ├── login.ts                 # Login translations
│   │   ├── register.ts              # Registration translations
│   │   ├── shared.ts                # Shared translations
│   │   └── Surveys.ts               # Survey translations
│   └── utils/                       # Utility functions
├── public/                          # Static assets
├── .env                            # Environment variables
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── next.config.ts                  # Next.js configuration
└── eslint.config.mjs               # ESLint configuration
```

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm/yarn
- MongoDB database (local or cloud)
- Git for version control

### **Step 1: Clone and Install**
```bash
# Clone the repository
git clone <repository-url>
cd next-app

# Install dependencies
npm install
# or
yarn install
```

### **Step 2: Environment Configuration**
Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/survey-management
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/survey-management

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Optional: Additional configurations
NODE_ENV=development
PORT=3000
```

### **Step 3: Database Setup**
```bash
# Ensure MongoDB is running locally
# Or configure MongoDB Atlas connection string in .env
```

### **Step 4: Run the Application**
```bash
# Development mode
npm run dev
# or
yarn dev

# Production build
npm run build
npm start
```

### **Step 5: Access the Application**
- Open your browser and navigate to: `http://localhost:3000`
- Register an admin account or user account
- Start creating surveys and collecting responses!

## 👥 User Roles & Permissions

### **Admin Role**
**Dashboard Access:**
- View analytics dashboard with charts
- Filter data by date ranges
- Monitor system statistics

**Survey Management:**
- Create new surveys with multiple question types
- Edit existing surveys
- Activate/deactivate surveys
- View all survey responses
- Delete surveys if needed

**User Management:**
- View user statistics
- Access all user responses
- System administration capabilities

**Navigation Access:**
- Dashboard
- Add Survey
- Surveys (all surveys)
- Response List (all responses)
- Profile management

### **User Role**
**Survey Participation:**
- View available active surveys
- Submit responses to surveys
- View own response history
- Cannot access inactive surveys

**Profile Management:**
- Edit personal profile information
- View account details
- Change personal settings

**Navigation Access:**
- Surveys (available for participation)
- My Responses (personal history)
- Profile management
- No access to dashboard or admin features

## 🔍 Key Features Implementation

### **1. Authentication System**
```typescript
// JWT-based authentication with secure token handling
// Location: src/app/redux/slices/authSlice.ts

// Features:
- Secure login/logout with JWT tokens
- Password hashing with bcryptjs
- Role-based route protection
- Auto-logout on token expiry
- Persistent authentication state
```

### **2. Survey Creation System**
```typescript
// Dynamic form builder for surveys
// Location: src/app/addSurvey/page.tsx

// Supported Question Types:
- Text input questions
- Number input questions
- Radio button (single choice)
- Checkbox (multiple choice)
- Select dropdown options
- Dynamic question addition/removal
```

### **3. Analytics Dashboard**
```typescript
// Real-time analytics with date filtering
// Location: src/components/molecules/Dashboard/Dashboard.tsx

// Features:
- Date range picker with Popper component
- ApexCharts integration for visual data
- Real-time statistics cards
- Responsive design for all devices
- Redux-powered data management
```

### **4. Response Management**
```typescript
// Complete response handling system
// Location: src/app/add-response/page.tsx

// Features:
- Dynamic form rendering based on survey questions
- Client-side validation with error handling
- Support for all question types
- Response history tracking
- Admin response overview
```

### **5. Navigation System**
```typescript
// Role-based navigation with modern UI
// Location: src/components/molecules/Navigation/

// Features:
- Responsive sidebar navigation
- Role-based menu filtering
- Material-UI design system
- Fixed navbar with user menu
- Mobile-friendly responsive design
```

## 🔒 Security Features

### **Authentication & Authorization**
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Role Guards**: Route-level access control
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Sanitized input handling

### **Data Security**
- **MongoDB Security**: Secure database connections
- **Environment Variables**: Sensitive data protection
- **API Security**: Protected API endpoints
- **CORS Configuration**: Proper cross-origin setup

## 📊 Database Schema

### **User Model**
```typescript
{
  id: string (UUID)
  firstName: string (3-20 chars)
  lastName: string (3-20 chars)
  email: string (unique, validated)
  role: "Admin" | "User"
  password: string (hashed)
  otp: string (optional)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### **Survey Model**
```typescript
{
  id: string (UUID)
  title: string
  description: string
  questions: [
    {
      id: string
      label: string
      type: "text" | "number" | "radio" | "checkbox" | "select"
      options?: string[] (for radio/checkbox/select)
    }
  ]
  isActive: boolean
  createdBy: string (user ID)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### **Response Model**
```typescript
{
  id: string (UUID)
  surveyId: string (reference)
  userId: string (reference)
  answers: [
    {
      questionId: string
      selectedOptions: string[]
    }
  ]
  submittedAt: Date (auto)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## 🎨 UI/UX Features

### **Design System**
- **Material-UI Components**: Consistent design language
- **Responsive Layout**: Works on all device sizes
- **Dark/Light Theme**: Built-in theme support
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

### **User Experience**
- **Toast Notifications**: Real-time feedback
- **Form Validation**: Immediate validation feedback
- **Loading Indicators**: Progress feedback for all operations
- **Responsive Charts**: Interactive data visualization
- **Intuitive Navigation**: Clear menu structure
- **Search & Filter**: Easy data discovery

## 🚀 Performance Optimizations

### **Frontend Optimizations**
- **Next.js 14**: Latest framework optimizations
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js image optimization
- **Lazy Loading**: Component lazy loading where appropriate
- **Redux Middleware**: Efficient state management

### **Backend Optimizations**
- **Database Indexing**: Optimized MongoDB queries
- **API Caching**: Strategic response caching
- **Aggregation Pipelines**: Efficient data aggregation
- **Connection Pooling**: MongoDB connection optimization

## 🧪 Testing Strategy

### **Frontend Testing**
- **Component Testing**: React component unit tests
- **Redux Testing**: State management testing
- **Form Validation Testing**: Input validation tests
- **Integration Testing**: Page-level integration tests

### **Backend Testing**
- **API Testing**: Endpoint functionality tests
- **Database Testing**: Model and query tests
- **Authentication Testing**: Security feature tests
- **Service Testing**: Business logic unit tests

## 📈 Future Enhancements

### **Planned Features**
- **Email Notifications**: Survey invitation emails
- **Advanced Analytics**: More detailed reporting
- **Survey Templates**: Pre-built survey templates
- **Export Functionality**: PDF/Excel export options
- **Multi-language Support**: Internationalization
- **Real-time Updates**: WebSocket integration
- **Survey Logic**: Conditional question flows
- **File Uploads**: Support for file upload questions

### **Technical Improvements**
- **PWA Support**: Progressive Web App features
- **Advanced Caching**: Redis integration
- **Microservices**: Service-oriented architecture
- **Docker**: Containerization support
- **CI/CD Pipeline**: Automated deployment
- **Monitoring**: Application performance monitoring

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### **Code Standards**
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message standards

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 📞 Support

For support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using Next.js, TypeScript, and Material-UI**
