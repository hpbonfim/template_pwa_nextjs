// useNavigator.tsx
"use client";
import { useMemo } from "react";

interface INavigator {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useNavigator(): INavigator {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: false
      };
    } else {
      const navigator = window.navigator;
      return {
        isMobile:
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ),
        isTablet: /iPad|Android(?!.*Mobile)|webOS/i.test(navigator.userAgent),
        isDesktop: !(
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ) || /iPad|Android(?!.*Mobile)|webOS/i.test(navigator.userAgent)
        ),
        ...navigator
      };
    }
  }, []);
}
