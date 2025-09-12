# Survey Management Application

A modern, full-stack survey management application built with Next.js, featuring user authentication, role-based access control, and comprehensive analytics dashboard.

## 🚀 Features

### Core Features
- **User Authentication & Authorization**: Secure login/register with JWT tokens
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Survey Creation & Management**: Dynamic survey builder with multiple field types
- **Response Collection**: Collect and manage survey responses
- **Analytics Dashboard**: Real-time analytics with interactive charts and date filtering
- **Responsive Design**: Mobile-first approach with Material-UI components

### Technical Features
- **Server-Side Rendering (SSR)**: Next.js App Router for optimal performance
- **Type Safety**: Full TypeScript implementation
- **State Management**: Redux Toolkit for predictable state updates
- **Database Integration**: MongoDB with Mongoose ODM
- **Form Validation**: React Hook Form with Yup/Zod validation
- **Charts & Visualization**: ApexCharts for interactive data visualization
- **Date Range Filtering**: React Date Range picker for analytics

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.0 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form
- **Charts**: ApexCharts + React ApexCharts
- **Date Picker**: React Date Range
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Material-UI Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Yup & Zod

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Turbopack (Next.js)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── dashboard/            # Dashboard analytics API
│   │   ├── login/                # Authentication API
│   │   ├── register/             # User registration API
│   │   ├── surveys/              # Survey management API
│   │   └── responses/            # Response collection API
│   ├── dashboard/                # Admin dashboard
│   ├── surveys/                  # Survey listing page
│   ├── addSurvey/               # Survey creation page
│   ├── responses/               # Response management
│   └── profile/                 # User profile page
├── Backend/                      # Backend services & models
│   ├── config/                   # Database configuration
│   ├── controller/               # API controllers
│   ├── model/                    # Database models
│   ├── services/                 # Business logic
│   ├── types/                    # TypeScript interfaces
│   ├── utils/                    # Utility functions
│   └── validations/              # Input validation schemas
├── components/                   # React components
│   ├── Atoms/                    # Basic UI components
│   ├── molecules/                # Composite components
│   │   ├── Dashboard/            # Dashboard components
│   │   ├── Navigation/           # Navigation components
│   │   └── Surveys/              # Survey-related components
│   └── Auth/                     # Authentication components
├── locales/                      # Internationalization
├── shared/                       # Shared utilities & hooks
├── types/                        # Global TypeScript types
└── utils/                        # Utility functions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/survey-app
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key
   
   # Next.js
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Models

### User Model
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "User";
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}
```

### Survey Model
```typescript
{
  id: string;
  title: string;
  description: string;
  questions: IField[];
  createdBy: ObjectId; // User reference
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Response Model
```typescript
{
  id: string;
  surveyId: string;
  userId: string;
  answers: Array<{
    questionId: string;
    selectedOptions: string[];
  }>;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full access to all features including analytics dashboard
- **User**: Can create surveys and submit responses

### Protected Routes
- Dashboard: Admin only
- Survey Creation: Authenticated users
- Response Submission: Authenticated users

### JWT Token Structure
```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "role": "Admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 📊 Analytics Dashboard

The analytics dashboard provides comprehensive insights:

### Key Metrics
- **Total Surveys**: Count of active surveys
- **Total Responses**: Count of all responses
- **Total Users**: Count of registered users

### Interactive Charts
- **Line Chart**: Survey and response trends over time
- **Date Range Filtering**: Custom date range selection
- **Real-time Updates**: Data refreshes based on selected date range

### API Endpoints
```typescript
POST /api/dashboard/analytics
Body: { startDate: "YYYY-MM-DD", endDate: "YYYY-MM-DD" }
Response: {
  totalSurveys: number;
  totalResponses: number;
  totalUsers: number;
  chartData: {
    dates: string[];
    surveys: number[];
    responses: number[];
  };
}
```

## 🎨 UI Components

### Design System
- **Color Scheme**: Material Design palette
- **Typography**: Roboto font family
- **Spacing**: 8px grid system
- **Breakpoints**: Mobile-first responsive design

### Key Components
- `Dashboard`: Analytics dashboard with charts
- `SurveyBuilder`: Dynamic survey creation form
- `ResponseViewer`: Response data visualization
- `AuthProvider`: Authentication state management
- `RoleGuard`: Route protection based on user roles

## 🧪 Development Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
```

## 🔧 Configuration

### Next.js Configuration
- **Turbopack**: Enabled for faster development builds
- **App Router**: Using the new Next.js 13+ app directory structure
- **TypeScript**: Strict mode enabled

### ESLint Configuration
- **Next.js Rules**: Extended from `next/core-web-vitals`
- **TypeScript Rules**: Strict TypeScript linting

## 🚀 Deployment

### Build Process
1. Run type checking: `tsc --noEmit`
2. Build application: `npm run build`
3. Start production server: `npm start`

### Environment Variables
Ensure all required environment variables are set in your deployment environment:
- `MONGODB_URI`
- `JWT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Next.js and TypeScript**
