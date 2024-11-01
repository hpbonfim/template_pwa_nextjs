"use client";
import React, { useEffect, useState, useCallback, memo } from "react";

import { Download, FileWarning, ImageIcon, Trash2, Video } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { DATABASE } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { useIndexedDB } from "@/hooks/useIndexedDB";
import type { IMediaFile } from "@/hooks/useMediaDevices";

interface MediaItemProps {
  item: IMediaFile;
  onDelete: (item: IMediaFile) => void;
  onDownload: (item: IMediaFile) => void;
}

const MediaItem: React.FC<MediaItemProps> = memo(
  ({ item, onDelete, onDownload }) => {
    const url =
      (item.data instanceof Blob || item.data instanceof MediaSource) &&
      URL.createObjectURL(item.data);

    return (
      <Card className="flex h-full flex-col items-center text-center align-middle">
        <CardTitle className="mt-4">
          {item.fileType === "image/jpeg" ? <ImageIcon /> : <Video />}
        </CardTitle>
        <hr className="mt-2 w-[100px]" />
        <CardDescription className="my-2">{item.id}</CardDescription>
        <CardContent className="flex aspect-square flex-col items-center justify-center">
          {item.fileType === "image/jpeg" && typeof url === "string" && (
            <Image
              src={url}
              alt="Captured media"
              className="size-full rounded-md border object-cover"
              width={1000}
              height={1000}
            />
          )}
          {item.fileType === "video/mp4" && typeof url === "string" && (
            <video
              src={url}
              controls
              className="size-full rounded-md border object-cover"
            >
              <track kind="captions" />
            </video>
          )}
        </CardContent>
        <hr className="mt-2 w-1/4" />
        {typeof url === "string" && (
          <div className="m-auto my-4 flex flex-row gap-2">
            <Button
              onClick={() => onDownload(item)}
              variant="secondary"
              size="icon"
            >
              <Download className="size-4" />
            </Button>
            <Button
              onClick={() => onDelete(item)}
              variant="destructive"
              size="icon"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )}
      </Card>
    );
  }
);

MediaItem.displayName = "MediaItem";

export const GalleryCard: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<IMediaFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { getAllItems, deleteItem } = useIndexedDB<IMediaFile>(
    DATABASE.IDB_STORE_FILES
  );

  const fetchMediaItems = useCallback(async () => {
    setIsLoading(true);
    const items = await getAllItems();
    setMediaItems(items);
    setIsLoading(false);
  }, [getAllItems]);

  useEffect(() => {
    fetchMediaItems();

    const handleDatabaseChange = (
      event: CustomEvent<{ storeName: string }>
    ) => {
      if (event.detail.storeName === DATABASE.IDB_STORE_FILES) {
        fetchMediaItems();
      }
    };

    window.addEventListener(
      DATABASE.IDB_EVENT_KEY,
      handleDatabaseChange as EventListener
    );

    return () => {
      window.removeEventListener(
        DATABASE.IDB_EVENT_KEY,
        handleDatabaseChange as EventListener
      );
    };
  }, [fetchMediaItems]);

  const handleDelete = async (item: IMediaFile) => {
    await deleteItem(item.id);
    setMediaItems((prevItems) => prevItems.filter((obj) => obj.id !== item.id));
  };

  const handleDownload = (item: IMediaFile) => {
    try {
      if (item.data instanceof Blob || item.data instanceof MediaSource) {
        const url = URL.createObjectURL(item.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.fileName!;
        a.click();
        URL.revokeObjectURL(url);
      }
      throw new Error("Download not supported");
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error instanceof Error ? error.message : "Download not supported",
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
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index + 1} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <Card className="flex h-full flex-col items-center text-center align-middle">
        <CardTitle className="mt-4">
          <FileWarning />
        </CardTitle>
        <hr className="mt-2 w-[100px]" />
        <CardDescription className="my-2">No media items found</CardDescription>
      </Card>
    );
  }

  return (
    <Carousel
      opts={{
        align: "center"
      }}
      className="m-auto"
    >
      <CarouselContent>
        {mediaItems.map((item) => (
          <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <MediaItem
                item={item}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
