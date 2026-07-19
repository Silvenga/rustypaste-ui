"use client";

import { useState, useEffect, useCallback } from "react";

interface NetworkInformation {
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: "2g" | "3g" | "4g" | "slow-2g";
  rtt?: number;
  saveData?: boolean;
  type?: "bluetooth" | "cellular" | "ethernet" | "none" | "wifi" | "wimax" | "other" | "unknown";
}

interface UseNetworkInformationReturn {
  networkInfo: NetworkInformation | null;
  isOnline: boolean;
  isSupported: boolean;
  refresh: () => void;
}

export const useNetworkInformation = (): UseNetworkInformationReturn => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInformation | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  const isSupported =
    typeof navigator !== "undefined" &&
    "connection" in navigator &&
    navigator.connection !== undefined;

  const updateNetworkInfo = useCallback(() => {
    if (!isSupported) return;

    const connection = (navigator as any).connection;

    setNetworkInfo({
      downlink: connection.downlink,
      downlinkMax: connection.downlinkMax,
      effectiveType: connection.effectiveType,
      rtt: connection.rtt,
      saveData: connection.saveData,
      type: connection.type,
    });
  }, [isSupported]);

  const handleOnlineStatusChange = useCallback(() => {
    setIsOnline(navigator.onLine);
  }, []);

  const handleConnectionChange = useCallback(() => {
    updateNetworkInfo();
  }, [updateNetworkInfo]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial network info
    updateNetworkInfo();

    // Listen for online/offline events
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    // Listen for connection changes
    if (isSupported) {
      const connection = (navigator as any).connection;
      connection.addEventListener("change", handleConnectionChange);
    }

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);

      if (isSupported) {
        const connection = (navigator as any).connection;
        connection.removeEventListener("change", handleConnectionChange);
      }
    };
  }, [isSupported, updateNetworkInfo, handleOnlineStatusChange, handleConnectionChange]);

  return {
    networkInfo,
    isOnline,
    isSupported,
    refresh: updateNetworkInfo,
  };
};

export default useNetworkInformation;
