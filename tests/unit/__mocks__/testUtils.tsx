import { configureStore } from '@reduxjs/toolkit'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ReactElement } from 'react'
import { authReducer } from '@/app/redux/slices/authSlice'
import { surveyReducer } from '@/app/redux/slices/surveySlice'
import { responseReducer } from '@/app/redux/slices/responseSlice'
import { profileReducer } from '@/app/redux/slices/profileSlice'
import { analyticsReducer } from '@/app/redux/slices/analyticsSlice'
import { mockAuthState, mockAdminAuthState } from './mockData'

// Create a test store
export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      survey: surveyReducer,
      response: responseReducer,
      profile: profileReducer,
      analytics: analyticsReducer,
    },
    preloadedState: initialState,
  })
}

// Default initial state for tests
export const defaultTestState = {
  auth: {
    isAuthenticated: false,
    token: null,
    user: null,
    id: null,
    email: null,
    role: null,
    firstName: null,
    lastName: null,
    loading: false,
    error: null,
  },
  survey: {
    surveys: [],
    currentSurvey: null,
    loading: false,
    error: null,
    count: 0,
  },
  response: {
    loading: false,
    error: null,
    submissionSuccess: false,
    currentResponse: null,
    userResponses: {
      data: [],
      count: 0,
    },
    allResponses: {
      data: [],
      count: 0,
    },
  },
  profile: {
    loading: false,
    error: null,
    profileData: null,
    updateSuccess: false,
  },
  analytics: {
    loading: false,
    error: null,
    data: null,
  },
}

// Authenticated user state for tests
export const authenticatedUserState = {
  ...defaultTestState,
  auth: {
    ...defaultTestState.auth,
    ...mockAuthState,
  },
}

// Authenticated admin state for tests
export const authenticatedAdminState = {
  ...defaultTestState,
  auth: {
    ...defaultTestState.auth,
    ...mockAdminAuthState,
  },
}

// Test wrapper with Redux Provider
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any
  store?: ReturnType<typeof createTestStore>
}

export const renderWithRedux = (
  ui: ReactElement,
  {
    initialState = defaultTestState,
    store = createTestStore(initialState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
  }
}

// Mock Axios for API testing
export const mockAxios = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
}

// Mock dispatch function
export const mockDispatch = jest.fn()

// Mock useSelector hook
export const mockUseSelector = jest.fn()

// Helper function to create mock Redux hooks
export const createMockReduxHooks = (state: any) => ({
  useSelector: (selector: any) => selector(state),
  useDispatch: () => mockDispatch,
})

// Test utilities for common assertions
export const expectToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument()
}

export const expectNotToBeInDocument = (element: HTMLElement | null) => {
  expect(element).not.toBeInTheDocument()
}

export const expectToHaveClass = (element: HTMLElement, className: string) => {
  expect(element).toHaveClass(className)
}

export const expectToHaveText = (element: HTMLElement, text: string) => {
  expect(element).toHaveTextContent(text)
}

// Mock Material-UI theme provider for testing
export const mockTheme = {
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  spacing: (factor: number) => `${8 * factor}px`,
}
