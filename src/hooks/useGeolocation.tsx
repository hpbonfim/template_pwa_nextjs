"use client";
import { useState, useEffect } from "react";

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  granted: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    granted: false
  });

  useEffect(() => {
    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        granted: true
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "Failed to get your location.";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Permission denied.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out.";
          break;
      }
      setState((prevState) => ({
        ...prevState,
        error: errorMessage,
        granted: false
      }));
    };

    if (!navigator.geolocation) {
      setState((prevState) => ({
        ...prevState,
        error: "Geolocation is not supported by your browser.",
        granted: false
      }));
      return;
    }

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        setState((prevState) => ({ ...prevState, granted: true }));
      } else if (result.state === "prompt") {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      } else if (result.state === "denied") {
        setState((prevState) => ({
          ...prevState,
          error: "Permission denied.",
          granted: false
        }));
      }
    });
  }, []);

  return state;
};
