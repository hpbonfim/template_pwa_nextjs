import type { Metadata } from "next";
import dynamic from "next/dynamic";

import Loading from "./loading";

const StreamimgCard = dynamic(
  () => import("@/app/streaming/_components/card"),
  {
    ssr: false,
    loading: () => <Loading />
  }
);

export const metadata: Metadata = {
  title: "Stream API"
};

export default function Page() {
  return <StreamimgCard />;
}
