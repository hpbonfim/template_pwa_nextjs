import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="container flex grow flex-col py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-semibold">Posts</h1>
      </div>
      <div className="grid grow place-content-center">
        <Loader className="size-8 animate-spin" />
      </div>
    </div>
  );
}
