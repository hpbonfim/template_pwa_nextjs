"use client";

import { useState, useEffect } from "react";

export interface ShareError {
  message: string;
  code?: string;
}

interface WebShareOptions {
  /**
   * A function to call when the share operation is successful.
   */
  onSuccess?: () => void;
  /**
   * A function to call when the share operation fails.
   * It receives a `ShareError` object as an argument.
   */
  onError?: (error: ShareError) => void;
}

interface WebShareState {
  isSupported: boolean | null;
  share: (data: ShareData, options?: WebShareOptions) => Promise<void>;
  error: ShareError | null;
  isLoading: boolean;
}

export const useWebShare = (): WebShareState => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<ShareError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSupported(!!navigator?.share);
  }, []);

  const share = async (data: ShareData, options: WebShareOptions = {}) => {
    const { onSuccess, onError } = options;

    if (!isSupported) {
      const error: ShareError = {
        message: "Web Share API is not supported by your browser.",
        code: "unsupported"
      };
      setError(error);
      onError?.(error);
      return;
    }

    try {
      setIsLoading(true);
      await navigator.share(data);
      setError(null);
      onSuccess?.();
    } catch (err) {
      let message = "Failed to share.";
      let code: string | undefined;

      if (err instanceof DOMException) {
        switch (err.name) {
          case "AbortError":
            message = "Share cancelled.";
            code = "abort";
            break;
          case "TypeError":
            message = "Invalid share data provided.";
            code = "invalid_data";
            break;
          default:
            message = err.message;
            code = err.name;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      const error: ShareError = { message, code };
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isSupported, share, error, isLoading };
};
