import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { TabNames, useHashRoute } from "@/components/use-hash-route.ts";

function setHash(hash: string) {
  window.history.replaceState(null, "", hash);
}

afterEach(() => {
  setHash("");
});

test("When no hash is set then the route should default to files", () => {
  setHash("");

  const { result } = renderHook(() => useHashRoute());

  expect(result.current[0]).toBe(TabNames.files);
});

test("When the hash is a valid tab then the route should match the hash", () => {
  setHash("#url");

  const { result } = renderHook(() => useHashRoute());

  expect(result.current[0]).toBe(TabNames.url);
});

test("When the hash is invalid then the route should default to files", () => {
  setHash("#invalid");

  const { result } = renderHook(() => useHashRoute());

  expect(result.current[0]).toBe(TabNames.files);
});

test("When setRoute is called with a valid tab then the hash and route should update", () => {
  setHash("");

  const { result } = renderHook(() => useHashRoute());

  act(() => {
    result.current[1](TabNames.history);
  });

  expect(result.current[0]).toBe(TabNames.history);
  expect(window.location.hash).toBe("#history");
});

test("When setRoute is called with an invalid tab then the route should default to files", () => {
  setHash("#url");

  const { result } = renderHook(() => useHashRoute());

  act(() => {
    result.current[1]("invalid");
  });

  expect(result.current[0]).toBe(TabNames.files);
  expect(window.location.hash).toBe("#files");
});

test("When setRoute is called with a tab matching the current hash then the route should not change", () => {
  setHash("#url");

  const { result } = renderHook(() => useHashRoute());

  act(() => {
    result.current[1](TabNames.url);
  });

  expect(result.current[0]).toBe(TabNames.url);
});

test("When a hashchange event fires then the route should update to the new hash", () => {
  setHash("");

  const { result } = renderHook(() => useHashRoute());

  act(() => {
    setHash("#history");
    window.dispatchEvent(new Event("hashchange"));
  });

  expect(result.current[0]).toBe(TabNames.history);
});
