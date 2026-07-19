import { renderHook, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useVersions } from "@/components/useVersions.ts";

const getVersion = vi.fn();

vi.mock("@/api/getVersion.ts", () => ({
  getVersion: (args: unknown) => getVersion(args),
}));

vi.mock("@/components/useAuth.ts", () => ({
  useAuth: () => ({
    authKey: {
      token: "test-token",
      instanceUrl: "https://example.com",
      checkForReleases: true,
    },
    isAuthenticated: true,
    setAuth: vi.fn(),
    clearAuth: vi.fn(),
  }),
}));

test("When the server returns a version then useVersions should expose it", async () => {
  getVersion.mockResolvedValue("1.2.3");

  const { result } = renderHook(() => useVersions());

  await waitFor(() => {
    expect(result.current.serverVersion).toBe("1.2.3");
  });

  expect(getVersion).toHaveBeenCalledWith({
    token: "test-token",
    instanceUrl: "https://example.com",
    signal: expect.any(AbortSignal),
  });
});

test("When the version fetch fails then useVersions should expose an undefined server version", async () => {
  getVersion.mockRejectedValue(new Error("network down"));

  const { result } = renderHook(() => useVersions());

  await waitFor(() => {
    expect(result.current.serverVersion).toBeUndefined();
  });
});

test("When the hook mounts then appVersion should fall back to a default when env is unset", async () => {
  getVersion.mockResolvedValue("0.0.0");

  const { result } = renderHook(() => useVersions());

  expect(result.current.appVersion).toBe("0.0.1");
});
