import type { Metadata } from "next";
import dynamic from "next/dynamic";

const GeolocationCard = dynamic(
  () => import("@/app/geolocation/_components/card"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Geolocation"
};

export default function Page() {
  return <GeolocationCard />;
}
