import { act, renderHook, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useFileUploads } from "@/components/sections/upload-file/useFileUploads.ts";

const uploadFile = vi.fn();

vi.mock("@/api/uploadFile.ts", () => ({
  uploadFile: (args: unknown) => uploadFile(args),
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

function makeFile(name = "test.txt") {
  return new File(["hello"], name, { type: "text/plain" });
}

test("When uploadFile resolves then the file should transition to uploaded with the returned url", async () => {
  uploadFile.mockImplementation((args: { onProgress: (p: number) => void }) => {
    args.onProgress(1);
    return Promise.resolve("https://example.com/abc.txt");
  });

  const { result } = renderHook(() => useFileUploads());

  expect(result.current.files).toEqual([]);

  await act(async () => {
    await result.current.uploadFile(makeFile());
  });

  await waitFor(() => {
    expect(result.current.files[0]?.state).toBe("uploaded");
  });

  expect(result.current.files[0]).toMatchObject({
    state: "uploaded",
    url: "https://example.com/abc.txt",
  });
});

test("When uploadFile rejects then the file should transition to errored with the message", async () => {
  uploadFile.mockRejectedValue(new Error("boom"));

  const { result } = renderHook(() => useFileUploads());

  await act(async () => {
    await result.current.uploadFile(makeFile());
  });

  await waitFor(() => {
    expect(result.current.files[0]?.state).toBe("errored");
  });

  expect(result.current.files[0]).toMatchObject({
    state: "errored",
    error: "boom",
  });
});

test("When uploadFile rejects with a non-Error value then the file error should be Unknown error", async () => {
  uploadFile.mockRejectedValue("string thrown");

  const { result } = renderHook(() => useFileUploads());

  await act(async () => {
    await result.current.uploadFile(makeFile());
  });

  await waitFor(() => {
    expect(result.current.files[0]?.state).toBe("errored");
  });

  expect(result.current.files[0]).toMatchObject({
    state: "errored",
    error: "Unknown error",
  });
});

test("When removeFile is called with an existing id then the file should be removed from the list", async () => {
  uploadFile.mockResolvedValue("https://example.com/abc.txt");

  const { result } = renderHook(() => useFileUploads());

  await act(async () => {
    await result.current.uploadFile(makeFile("a.txt"));
  });
  await act(async () => {
    await result.current.uploadFile(makeFile("b.txt"));
  });

  await waitFor(() => expect(result.current.files).toHaveLength(2));

  const firstId = result.current.files[0]!.id;

  act(() => {
    result.current.removeFile(firstId);
  });

  expect(result.current.files.find((f) => f.id === firstId)).toBeUndefined();
});

test("When onProgress fires then the file should transition to uploading with progress metadata", async () => {
  uploadFile.mockImplementation(
    (args: { onProgress: (p: number, r?: number, e?: number) => void }) => {
      args.onProgress(0.5, 1024, 2);
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      }).then(() => "https://example.com/abc.txt");
    },
  );

  const { result } = renderHook(() => useFileUploads());

  await act(async () => {
    await result.current.uploadFile(makeFile());
  });

  await waitFor(() => {
    expect(result.current.files[0]?.state).toBe("uploaded");
  });

  expect(uploadFile).toHaveBeenCalledWith(
    expect.objectContaining({
      token: "test-token",
      instanceUrl: "https://example.com",
      oneShot: false,
    }),
  );
});
