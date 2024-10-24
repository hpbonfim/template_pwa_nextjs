import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    </div>
  );
}
