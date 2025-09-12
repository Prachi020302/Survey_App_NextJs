describe("Basic Jest Test", () => {
  test("should run basic assertions", () => {
    expect(1 + 1).toBe(2);
    expect("hello").toBe("hello");
    expect(true).toBe(true);
  });

  test("should work with arrays and objects", () => {
    const testArray = [1, 2, 3];
    const testObject = { name: "test", value: 42 };

    expect(testArray).toHaveLength(3);
    expect(testArray).toContain(2);
    expect(testObject).toHaveProperty("name");
    expect(testObject.name).toBe("test");
  });

  test("should handle async operations", async () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve("resolved"), 10);
    });

    const result = await promise;
    expect(result).toBe("resolved");
  });

  test("should work with mock functions", () => {
    const mockFn = jest.fn();
    mockFn("test");

    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledWith("test");
  });
});
