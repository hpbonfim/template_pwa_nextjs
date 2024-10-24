"use client";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { LINKS } from "@/constants";

import { CameraCard } from "./camera";
import { GalleryCard } from "./gallery";
import { ScreenCard } from "./screen";

const MediaCaptureCard: React.FC = () => {
  return (
    <main className="grid grow place-content-center gap-4 text-center">
      <Card className="m-8 border-transparent">
        <CardHeader>
          <CardTitle>
            <a href={LINKS.MZL_URL} target="_blank" rel="noopener noreferrer">
              streaming API
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg border"
          >
            <ResizablePanel defaultSize={50}>
              <ScreenCard />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <CameraCard />
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
        <CardContent>
          <GalleryCard />
        </CardContent>
      </Card>
    </main>
  );
};

export default MediaCaptureCard;
