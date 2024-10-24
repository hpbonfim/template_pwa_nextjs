"use client";
import { useState, useEffect } from "react";

interface NotificationState {
  isSupported: boolean;
  granted: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  showNotification: (title: string, options?: NotificationOptions) => void;
}

export const useNotification = (): NotificationState => {
  const [isSupported, setIsSupported] = useState(false);
  const [granted, setGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported("Notification" in window);
    // Check initial permission status
    if ("Notification" in window) {
      setGranted(Notification.permission === "granted");
    }
  }, []);

  const requestPermission = async () => {
    setError(null); // Clear any previous errors
    if (!isSupported) {
      setError("Notifications are not supported by your browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setGranted(permission === "granted");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to request permission"
      );
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    setError(null); // Clear any previous errors
    if (!isSupported) {
      setError("Notifications are not supported by your browser.");
      return;
    }

    if (granted) {
      try {
        // Attempt to use service worker for better reliability
        if ("serviceWorker" in navigator && "PushManager" in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, options);
          });
        } else {
          new Notification(title, options);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to show notification."
        );
      }
    } else {
      setError("Notification permission not granted.");
    }
  };

  return { isSupported, granted, error, requestPermission, showNotification };
};
