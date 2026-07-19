"use client";

import { useEffect, useRef } from "react";

// Deep equality comparison function
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a == null || b == null) return a === b;

  if (typeof a !== typeof b) return false;

  if (typeof a !== "object") return a === b;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

// Deep compare dependencies
function useDeepCompareMemoize(value: React.DependencyList | undefined) {
  const ref = useRef<React.DependencyList | undefined>(undefined);

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  const memoizedDeps = useDeepCompareMemoize(deps);

  useEffect(effect, memoizedDeps); // oxlint-disable-line react/exhaustive-deps
}

export default useDeepCompareEffect;
