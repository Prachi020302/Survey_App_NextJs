// Mock user data
export const mockUsers = [
  {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'User',
    password: 'hashedPassword123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'Admin',
    password: 'hashedPassword456',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'user-3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    role: 'User',
    password: 'hashedPassword789',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
]

// Mock survey data
export const mockSurveys = [
  {
    id: 'survey-1',
    title: 'Customer Satisfaction Survey',
    description: 'Help us improve our services',
    questions: [
      {
        id: 'q1',
        label: 'How satisfied are you with our service?',
        type: 'radio',
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
      },
      {
        id: 'q2',
        label: 'What is your name?',
        type: 'text',
      },
      {
        id: 'q3',
        label: 'How old are you?',
        type: 'number',
      },
      {
        id: 'q4',
        label: 'Which services do you use?',
        type: 'checkbox',
        options: ['Web Development', 'Mobile Development', 'Consulting', 'Support'],
      },
      {
        id: 'q5',
        label: 'How did you hear about us?',
        type: 'select',
        options: ['Google', 'Social Media', 'Friend', 'Advertisement'],
      },
    ],
    isActive: true,
    createdBy: 'user-2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'survey-2',
    title: 'Product Feedback Survey',
    description: 'Tell us about your experience with our product',
    questions: [
      {
        id: 'q1',
        label: 'Rate our product',
        type: 'radio',
        options: ['Excellent', 'Good', 'Average', 'Poor'],
      },
      {
        id: 'q2',
        label: 'Any suggestions?',
        type: 'text',
      },
    ],
    isActive: false,
    createdBy: 'user-2',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
]

// Mock response data
export const mockResponses = [
  {
    id: 'response-1',
    surveyId: 'survey-1',
    userId: 'user-1',
    answers: [
      {
        questionId: 'q1',
        selectedOptions: ['Very Satisfied'],
      },
      {
        questionId: 'q2',
        selectedOptions: ['John Doe'],
      },
      {
        questionId: 'q3',
        selectedOptions: ['25'],
      },
      {
        questionId: 'q4',
        selectedOptions: ['Web Development', 'Consulting'],
      },
      {
        questionId: 'q5',
        selectedOptions: ['Google'],
      },
    ],
    submittedAt: new Date('2024-01-01T10:00:00Z'),
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: 'response-2',
    surveyId: 'survey-1',
    userId: 'user-3',
    answers: [
      {
        questionId: 'q1',
        selectedOptions: ['Satisfied'],
      },
      {
        questionId: 'q2',
        selectedOptions: ['Bob Johnson'],
      },
      {
        questionId: 'q3',
        selectedOptions: ['30'],
      },
      {
        questionId: 'q4',
        selectedOptions: ['Mobile Development'],
      },
      {
        questionId: 'q5',
        selectedOptions: ['Friend'],
      },
    ],
    submittedAt: new Date('2024-01-02T14:30:00Z'),
    createdAt: new Date('2024-01-02T14:30:00Z'),
    updatedAt: new Date('2024-01-02T14:30:00Z'),
  },
]

// Mock analytics data
export const mockAnalyticsData = {
  totalSurveys: 2,
  totalResponses: 2,
  totalUsers: 2,
  chartData: {
    dates: ['2024-01-01', '2024-01-02', '2024-01-03'],
    surveys: [1, 1, 0],
    responses: [1, 1, 0],
  },
}

// Mock auth state
export const mockAuthState = {
  isAuthenticated: true,
  token: 'mock-jwt-token',
  user: mockUsers[0],
  id: 'user-1',
  email: 'john.doe@example.com',
  role: 'User',
  firstName: 'John',
  lastName: 'Doe',
}

export const mockAdminAuthState = {
  isAuthenticated: true,
  token: 'mock-admin-jwt-token',
  user: mockUsers[1],
  id: 'user-2',
  email: 'jane.smith@example.com',
  role: 'Admin',
  firstName: 'Jane',
  lastName: 'Smith',
}

// Mock API responses
export const mockApiResponses = {
  surveys: {
    success: true,
    statusCode: 200,
    message: 'Surveys retrieved successfully',
    data: mockSurveys,
    count: mockSurveys.length,
  },
  responses: {
    success: true,
    statusCode: 200,
    message: 'Responses retrieved successfully',
    data: mockResponses,
    count: mockResponses.length,
  },
  analytics: {
    success: true,
    statusCode: 200,
    message: 'Analytics retrieved successfully',
    data: mockAnalyticsData,
  },
  profile: {
    success: true,
    statusCode: 200,
    message: 'Profile retrieved successfully',
    data: mockUsers[0],
  },
  login: {
    success: true,
    statusCode: 200,
    message: 'Login successful',
    data: {
      user: mockUsers[0],
      token: 'mock-jwt-token',
    },
  },
}

// Form data for testing
export const mockFormData = {
  survey: {
    title: 'Test Survey',
    description: 'This is a test survey',
    questions: [
      {
        id: 'q1',
        label: 'Test Question 1',
        type: 'text',
      },
      {
        id: 'q2',
        label: 'Test Question 2',
        type: 'radio',
        options: ['Option 1', 'Option 2'],
      },
    ],
  },
  response: {
    surveyId: 'survey-1',
    userId: 'user-1',
    answers: [
      {
        questionId: 'q1',
        selectedOptions: ['Test Answer'],
      },
      {
        questionId: 'q2',
        selectedOptions: ['Option 1'],
      },
    ],
  },
  profile: {
    firstName: 'Updated John',
    lastName: 'Updated Doe',
    email: 'updated.john@example.com',
  },
  login: {
    email: 'john.doe@example.com',
    password: 'password123',
  },
  register: {
    firstName: 'New',
    lastName: 'User',
    email: 'new.user@example.com',
    password: 'password123',
    role: 'User',
  },
}
