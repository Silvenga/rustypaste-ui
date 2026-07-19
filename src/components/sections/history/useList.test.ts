import { renderHook, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useList } from "@/components/sections/history/useList.ts";

const getList = vi.fn();
const delay = vi.fn<(ms: number, signal?: AbortSignal) => Promise<void>>(
  () => new Promise<void>(() => {}),
);

vi.mock("@/api/getList.ts", () => ({
  getList: (args: unknown) => getList(args),
}));

vi.mock("@/delay.ts", () => ({
  delay: (ms: number, signal?: AbortSignal) => delay(ms, signal),
}));

vi.mock("@/hooks/use-network-information.ts", () => ({
  default: () => ({
    networkInfo: null,
    isOnline: true,
    isSupported: false,
    refresh: vi.fn(),
  }),
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

test("When the list fetch succeeds then useList should expose the returned items", async () => {
  getList.mockResolvedValue([
    {
      url: "https://example.com/a.txt",
      fileName: "a.txt",
      fileSize: 10,
      createdAt: null,
      expiresAtUtc: null,
    },
  ]);

  const { result } = renderHook(() => useList());

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.list).toHaveLength(1);
  expect(result.current.list[0]).toMatchObject({
    fileName: "a.txt",
    fileSize: 10,
  });

  expect(getList).toHaveBeenCalledWith({
    token: "test-token",
    instanceUrl: "https://example.com",
    signal: expect.any(AbortSignal),
  });
});

test("When the list fetch rejects then useList should keep isLoading true and not throw", async () => {
  getList.mockRejectedValue(new Error("network down"));

  const { result } = renderHook(() => useList());

  await waitFor(() => {
    expect(getList).toHaveBeenCalled();
  });

  expect(result.current.isLoading).toBe(true);
  expect(result.current.list).toEqual([]);
});

test("When the hook mounts then isFetching should be true until the first fetch resolves", async () => {
  let releaseFetch: () => void = () => {};
  getList.mockReturnValue(
    new Promise((resolve) => {
      releaseFetch = () => resolve([]);
    }),
  );

  const { result } = renderHook(() => useList());

  expect(result.current.isFetching).toBe(true);

  releaseFetch();

  await waitFor(() => {
    expect(result.current.isFetching).toBe(false);
  });
});

test("When the component unmounts then the in-flight abort controller should abort the pending fetch", async () => {
  let aborted = false;
  getList.mockImplementation((args: { signal: AbortSignal }) => {
    args.signal.addEventListener("abort", () => {
      aborted = true;
    });
    return new Promise(() => {});
  });

  const { unmount } = renderHook(() => useList());

  await waitFor(() => expect(getList).toHaveBeenCalled());

  unmount();

  await waitFor(() => expect(aborted).toBe(true));
});
