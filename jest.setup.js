import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock react-apexcharts
jest.mock('react-apexcharts', () => {
  return {
    __esModule: true,
    default: (props) => (
      <div data-testid="mock-chart">
        Mock Chart - Type: {props.type}, Height: {props.height}
      </div>
    ),
  }
})

// Mock react-date-range
jest.mock('react-date-range', () => ({
  DateRange: (props) => (
    <div data-testid="mock-date-range">
      <button
        onClick={() =>
          props.onChange({
            selection: {
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-01-07'),
              key: 'selection',
            },
          })
        }
      >
        Mock Date Range
      </button>
    </div>
  ),
}))

// Mock moment
jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment')
  return {
    __esModule: true,
    default: jest.fn((date) => {
      if (date) {
        return actualMoment(date)
      }
      // Return a fixed date for consistency in tests
      return actualMoment('2024-01-01T00:00:00.000Z')
    }),
  }
})

// Global test setup
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
