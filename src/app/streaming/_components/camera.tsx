"use client";
import React, { useMemo, useEffect, useState } from "react";

import {
  Disc,
  MicOff,
  Monitor,
  MonitorOff,
  StopCircle,
  VideoOff,
  Camera,
  type LucideIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { useMediaCamera } from "@/hooks/useCapture";

import MediaCard from "./media";

interface CameraButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: LucideIcon;
  tooltipContent: string;
}

const CameraButton: React.FC<CameraButtonProps> = React.memo(
  ({ onClick, disabled, icon: Icon, tooltipContent }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            disabled={disabled}
            size="icon"
            aria-label={tooltipContent}
          >
            <Icon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
);

CameraButton.displayName = "CameraButton";

export const CameraCard: React.FC = () => {
  const [cameraState, cameraActions] = useMediaCamera();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const buttons = useMemo(() => {
    const { stream, audioEnabled, videoEnabled } = cameraState.camera;
    const isStreamActive = !!stream;
    return [
      {
        onClick: async () => cameraActions.startCapture(),
        disabled: isStreamActive,
        icon: Monitor,
        tooltipContent: "Start Camera Capture"
      },
      {
        onClick: async () => cameraActions.stopCapture(),
        disabled: !isStreamActive,
        icon: MonitorOff,
        tooltipContent: "Stop Camera Capture"
      },
      {
        onClick: async () => cameraActions.toggleAudio(),
        disabled: !isStreamActive,
        icon: MicOff,
        tooltipContent: audioEnabled
          ? "Mute Camera Audio"
          : "Unmute Camera Audio"
      },
      {
        onClick: async () => cameraActions.toggleVideo(),
        disabled: !isStreamActive,
        icon: VideoOff,
        tooltipContent: videoEnabled
          ? "Turn Off Camera Video"
          : "Turn On Camera Video"
      },
      {
        onClick: async () => cameraActions.startRecording(),
        disabled: cameraState.recording || !isStreamActive,
        icon: Disc,
        tooltipContent: "Start Camera Recording"
      },
      {
        onClick: async () => cameraActions.stopRecording(),
        disabled: !cameraState.recording,
        icon: StopCircle,
        tooltipContent: "Stop Camera Recording"
      },
      {
        onClick: async () => cameraActions.takePicture(),
        disabled: !isStreamActive,
        icon: Camera,
        tooltipContent: "Take Camera Picture"
      }
    ];
  }, [cameraState, cameraActions]);

  useEffect(() => {
    if (typeof window !== "undefined" && cameraState.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: cameraState.error ?? "Camera Capture is not supported",
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
  }, [cameraState.error]);

  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    await action();
    setIsLoading(false);
  };

  return (
    <MediaCard
      title="Camera Capture"
      description={`Permission granted: ${cameraState.granted ? "Yes" : "No"}`}
      controls={buttons.map((button, index) => (
        <CameraButton
          key={index + 1}
          onClick={() => handleAction(button.onClick)}
          disabled={button.disabled || isLoading}
          icon={button.icon}
          tooltipContent={button.tooltipContent}
        />
      ))}
      content={
        cameraState.camera.stream ? (
          <video
            ref={(videoRef) => {
              if (videoRef) videoRef.srcObject = cameraState.camera.stream;
            }}
            autoPlay
            muted
            className="w-full rounded-lg"
          >
            <track kind="captions" />
          </video>
        ) : (
          <strong className="flex h-48 w-full items-center justify-center rounded-lg border-gray-100 bg-gray-200 text-black">
            Camera off
          </strong>
        )
      }
      isLoading={isLoading}
    />
  );
};
