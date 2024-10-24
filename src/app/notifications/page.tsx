import dynamic from "next/dynamic";

const Card = dynamic(() => import("./_components/_card"), { ssr: false });

export default function Page() {
  return <Card />;
}
