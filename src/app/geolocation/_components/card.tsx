"use client";
import React, { useMemo, useEffect } from "react";

import dynamic from "next/dynamic";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";

const GeolocationCard: React.FC = () => {
  const { toast } = useToast();
  const geolocation = useGeolocation();

  const LeafletMap = useMemo(
    () =>
      dynamic(() => import("@/app/geolocation/_components/map"), {
        loading: () => <Skeleton className="h-[125px] w-[250px] rounded-xl" />,
        ssr: false
      }),
    []
  );

  useEffect(() => {
    if (geolocation.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: geolocation.error,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => window.location.reload()}
          >
            Try again
          </ToastAction>
        )
      });
    }
  }, [geolocation.error, toast, geolocation]);

  return (
    <main className="m-10 grid grow gap-4 text-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Geolocation</CardTitle>
          <CardDescription className="text-center">
            Permission granted:{" "}
            <span className="font-semibold">
              {geolocation.granted ? "Yes" : "No"}
            </span>
          </CardDescription>
          <CardDescription className="text-center">
            Location:&nbsp;
            {geolocation.latitude && geolocation.longitude && (
              <span className="font-semibold">
                {geolocation.latitude.toFixed(4)},{" "}
                {geolocation.longitude.toFixed(4)}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="size-auto">
          {geolocation.latitude && geolocation.longitude && (
            <LeafletMap
              {...{ lat: geolocation.latitude, lng: geolocation.longitude }}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default GeolocationCard;
