"use client";
import { memo } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaCardProps {
  title: string;
  description: string;
  controls: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  isLoading: boolean;
}

const MediaCard: React.FC<MediaCardProps> = memo(
  ({ title, description, controls, content, footer, isLoading }) => (
    <Card className="w-full border-none text-center">
      <CardHeader>
        <CardTitle>
          {isLoading ? <Skeleton className="mx-auto h-6 w-1/2" /> : title}
        </CardTitle>
        <CardDescription>
          {isLoading ? (
            <Skeleton className="mx-auto mt-2 h-4 w-3/4" />
          ) : (
            description
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-row flex-wrap content-center justify-center gap-2 align-middle">
          {isLoading ? (
            <>
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="size-10 rounded-full" />
            </>
          ) : (
            controls
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          {isLoading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : (
            content
          )}
        </div>
      </CardFooter>
      {footer && (
        <CardFooter>
          {isLoading ? <Skeleton className="h-10 w-full rounded-lg" /> : footer}
        </CardFooter>
      )}
    </Card>
  )
);
MediaCard.displayName = "MediaCard";
export default MediaCard;
