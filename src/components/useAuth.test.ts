import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { useAuth } from "@/components/useAuth.ts";

afterEach(() => {
  localStorage.clear();
});

test("When no token is stored then the hook should be unauthenticated", () => {
  localStorage.clear();

  const { result } = renderHook(() => useAuth());

  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.authKey.token).toBe("");
  expect(result.current.authKey.instanceUrl).toBe("");
  expect(result.current.authKey.checkForReleases).toBe(true);
});

test("When a token is stored then the hook should be authenticated with the trimmed token", () => {
  localStorage.setItem(
    "auth-key",
    JSON.stringify({
      token: "  abc123  ",
      instanceUrl: "https://example.com/",
    }),
  );

  const { result } = renderHook(() => useAuth());

  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.authKey.token).toBe("abc123");
  expect(result.current.authKey.instanceUrl).toBe("https://example.com");
  expect(result.current.authKey.checkForReleases).toBe(true);
});

test("When the stored token omits checkForReleases then the hook should default it to true", () => {
  localStorage.setItem(
    "auth-key",
    JSON.stringify({ token: "abc", instanceUrl: "https://example.com" }),
  );

  const { result } = renderHook(() => useAuth());

  expect(result.current.authKey.checkForReleases).toBe(true);
});

test("When the stored instanceUrl has trailing slashes then the hook should strip them", () => {
  localStorage.setItem(
    "auth-key",
    JSON.stringify({ token: "abc", instanceUrl: "https://example.com////" }),
  );

  const { result } = renderHook(() => useAuth());

  expect(result.current.authKey.instanceUrl).toBe("https://example.com");
});

test("When setAuth is called then the hook should persist and reflect the new value", () => {
  localStorage.clear();

  const { result } = renderHook(() => useAuth());

  act(() => {
    result.current.setAuth({
      token: "new-token",
      instanceUrl: "https://api.example.com",
      checkForReleases: false,
    });
  });

  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.authKey.token).toBe("new-token");
  expect(result.current.authKey.instanceUrl).toBe("https://api.example.com");
  expect(result.current.authKey.checkForReleases).toBe(false);
  expect(JSON.parse(localStorage.getItem("auth-key") ?? "null")).toEqual({
    token: "new-token",
    instanceUrl: "https://api.example.com",
    checkForReleases: false,
  });
});

test("When clearAuth is called then the hook should clear storage and become unauthenticated", () => {
  localStorage.setItem(
    "auth-key",
    JSON.stringify({ token: "abc", instanceUrl: "https://example.com" }),
  );

  const { result } = renderHook(() => useAuth());

  act(() => {
    result.current.clearAuth();
  });

  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.authKey.token).toBe("");
  expect(localStorage.getItem("auth-key")).toBeNull();
});
