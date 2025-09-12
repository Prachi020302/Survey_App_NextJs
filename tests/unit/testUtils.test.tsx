import "@testing-library/jest-dom";
import {
  createTestStore,
  defaultTestState,
  authenticatedUserState,
  authenticatedAdminState,
  renderWithRedux,
  mockDispatch,
  mockUseSelector,
  expectToBeInDocument,
  expectNotToBeInDocument,
  expectToHaveClass,
  expectToHaveText,
} from "./__mocks__/testUtils";
import { mockAuthState, mockAdminAuthState } from "./__mocks__/mockData";

describe("Test Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTestStore", () => {
    test("should create a store with default state", () => {
      const store = createTestStore();
      const state = store.getState();

      expect(state).toHaveProperty("auth");
      expect(state).toHaveProperty("survey");
      expect(state).toHaveProperty("response");
      expect(state).toHaveProperty("profile");
      expect(state).toHaveProperty("analytics");
    });

    test("should create a store with custom initial state", () => {
      const customInitialState = {
        auth: {
          isAuthenticated: true,
          user: { id: "test-user" },
          token: "test-token",
        },
      };

      const store = createTestStore(customInitialState);
      const state = store.getState() as any;

      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.auth.user.id).toBe("test-user");
      expect(state.auth.token).toBe("test-token");
    });

    test("should allow dispatching actions", () => {
      const store = createTestStore();
      const testAction = { type: "TEST_ACTION", payload: "test" };

      expect(() => store.dispatch(testAction)).not.toThrow();
    });
  });

  describe("defaultTestState", () => {
    test("should have all required state slices", () => {
      expect(defaultTestState).toHaveProperty("auth");
      expect(defaultTestState).toHaveProperty("survey");
      expect(defaultTestState).toHaveProperty("response");
      expect(defaultTestState).toHaveProperty("profile");
      expect(defaultTestState).toHaveProperty("analytics");
    });

    test("should have correct initial values", () => {
      expect(defaultTestState.auth.isAuthenticated).toBe(false);
      expect(defaultTestState.auth.token).toBeNull();
      expect(defaultTestState.auth.user).toBeNull();
      expect(defaultTestState.survey.loading).toBe(false);
      expect(defaultTestState.response.loading).toBe(false);
      expect(defaultTestState.profile.loading).toBe(false);
      expect(defaultTestState.analytics.loading).toBe(false);
    });

    test("should have error states initialized to null", () => {
      expect(defaultTestState.auth.error).toBeNull();
      expect(defaultTestState.survey.error).toBeNull();
      expect(defaultTestState.response.error).toBeNull();
      expect(defaultTestState.profile.error).toBeNull();
      expect(defaultTestState.analytics.error).toBeNull();
    });
  });

  describe("authenticatedUserState", () => {
    test("should extend default state with auth data", () => {
      expect(authenticatedUserState.auth.isAuthenticated).toBe(true);
      expect(authenticatedUserState.auth.user).toEqual(mockAuthState.user);
      expect(authenticatedUserState.auth.role).toBe("User");
      expect(authenticatedUserState.auth.token).toBe(mockAuthState.token);
    });

    test("should preserve other state slices", () => {
      expect(authenticatedUserState.survey).toEqual(defaultTestState.survey);
      expect(authenticatedUserState.response).toEqual(
        defaultTestState.response
      );
      expect(authenticatedUserState.profile).toEqual(defaultTestState.profile);
      expect(authenticatedUserState.analytics).toEqual(
        defaultTestState.analytics
      );
    });
  });

  describe("authenticatedAdminState", () => {
    test("should have admin role", () => {
      expect(authenticatedAdminState.auth.isAuthenticated).toBe(true);
      expect(authenticatedAdminState.auth.user).toEqual(
        mockAdminAuthState.user
      );
      expect(authenticatedAdminState.auth.role).toBe("Admin");
      expect(authenticatedAdminState.auth.token).toBe(mockAdminAuthState.token);
    });
  });

  describe("renderWithRedux", () => {
    test("should render component with default state", () => {
      const TestComponent = () => <div data-testid="test">Test Component</div>;

      const { getByTestId } = renderWithRedux(<TestComponent />);

      expect(getByTestId("test")).toBeInTheDocument();
    });

    test("should render component with custom state", () => {
      const TestComponent = () => <div data-testid="test">Test Component</div>;

      const customState = authenticatedUserState;
      const { getByTestId, store } = renderWithRedux(<TestComponent />, {
        initialState: customState,
      });

      expect(getByTestId("test")).toBeInTheDocument();
      expect((store.getState() as any).auth.isAuthenticated).toBe(true);
    });

    test("should return store instance", () => {
      const TestComponent = () => <div>Test</div>;
      const { store } = renderWithRedux(<TestComponent />);

      expect(store).toBeDefined();
      expect(typeof store.dispatch).toBe("function");
      expect(typeof store.getState).toBe("function");
    });
  });

  describe("mock functions", () => {
    test("should provide mockDispatch function", () => {
      expect(typeof mockDispatch).toBe("function");

      const testAction = { type: "TEST" };
      mockDispatch(testAction);

      expect(mockDispatch).toHaveBeenCalledWith(testAction);
    });

    test("should provide mockUseSelector function", () => {
      expect(typeof mockUseSelector).toBe("function");

      const testSelector = (state: any) => state.auth.user;
      mockUseSelector(testSelector);

      expect(mockUseSelector).toHaveBeenCalledWith(testSelector);
    });
  });

  describe("assertion helpers", () => {
    test("should provide expectToBeInDocument helper", () => {
      const element = document.createElement("div");
      document.body.appendChild(element);

      expect(() => expectToBeInDocument(element)).not.toThrow();

      document.body.removeChild(element);
    });

    test("should provide expectNotToBeInDocument helper", () => {
      const element = document.createElement("div");

      expect(() => expectNotToBeInDocument(element)).not.toThrow();
    });

    test("should provide expectToHaveClass helper", () => {
      const element = document.createElement("div");
      element.className = "test-class";

      expect(() => expectToHaveClass(element, "test-class")).not.toThrow();
    });

    test("should provide expectToHaveText helper", () => {
      const element = document.createElement("div");
      element.textContent = "Test content";

      expect(() => expectToHaveText(element, "Test content")).not.toThrow();
    });
  });

  describe("edge cases", () => {
    test("should handle custom store in renderWithRedux", () => {
      const customStore = createTestStore(authenticatedUserState);
      const TestComponent = () => <div data-testid="custom">Custom</div>;

      const { getByTestId } = renderWithRedux(<TestComponent />, {
        store: customStore,
      });

      expect(getByTestId("custom")).toBeInTheDocument();
    });

    test("should handle render options in renderWithRedux", () => {
      const TestComponent = () => <div data-testid="options">Options</div>;

      const { container } = renderWithRedux(<TestComponent />, {
        container: document.body,
      });

      expect(container).toBe(document.body);
    });
  });
});
