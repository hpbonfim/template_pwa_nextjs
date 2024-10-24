import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="m-8 border-transparent">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-40" />
        </CardTitle>
      </CardHeader>
      <CardContent className="size-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border"
        >
          <ResizablePanel defaultSize={50}>
            <Card className="h-full">
              <CardHeader className="flex flex-col items-center justify-center">
                <CardTitle>
                  <Skeleton className="h-6 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="mb-4 flex justify-center space-x-2">
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="size-10 rounded-full" />
                </div>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <Card className="h-full">
              <CardHeader className="flex flex-col items-center justify-center">
                <CardTitle>
                  <Skeleton className="h-6 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center ">
                <div className="mb-4 flex justify-center space-x-2">
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="size-10 rounded-full" />
                </div>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
      <CardContent className="size-full">
        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-24" />
            </CardTitle>
          </CardHeader>
          <hr className="w-6/12 py-2" />
          <CardContent className="flex w-full flex-row items-center justify-center gap-2">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-wrap justify-center gap-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="size-32" />
              ))}
            </div>
            <Skeleton className="size-10 rounded-full" />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
