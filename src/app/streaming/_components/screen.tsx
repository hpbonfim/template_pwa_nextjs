"use client";
import { memo, useEffect, useMemo, useState, type FC } from "react";

import {
  Camera,
  Disc,
  MicOff,
  ScreenShare,
  ScreenShareOff,
  StopCircle,
  VideoOff,
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
import { useMediaScreen } from "@/hooks/useMediaDevices";

import MediaCard from "./media";

interface ScreenButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: LucideIcon;
  tooltipContent: string;
}

const ScreenButton: FC<ScreenButtonProps> = memo(
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

ScreenButton.displayName = "ScreenButton";

export const ScreenCard: React.FC = () => {
  const [screenState, screenActions] = useMediaScreen();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const buttons = useMemo(() => {
    const { stream, audioEnabled, videoEnabled } = screenState.screen;
    const isStreamActive = !!stream;
    return [
      {
        onClick: async () => screenActions.startCapture(),
        disabled: isStreamActive,
        icon: ScreenShare,
        tooltipContent: "Start Screen Share"
      },
      {
        onClick: async () => screenActions.stopCapture(),
        disabled: !isStreamActive,
        icon: ScreenShareOff,
        tooltipContent: "Stop Screen Share"
      },
      {
        onClick: async () => screenActions.toggleAudio(),
        disabled: !isStreamActive,
        icon: MicOff,
        tooltipContent: audioEnabled
          ? "Mute Screen Audio"
          : "Unmute Screen Audio"
      },
      {
        onClick: async () => screenActions.toggleVideo(),
        disabled: !isStreamActive,
        icon: VideoOff,
        tooltipContent: videoEnabled
          ? "Turn Off Screen Video"
          : "Turn On Screen Video"
      },
      {
        onClick: async () => screenActions.startRecording(),
        disabled: screenState.recording || !isStreamActive,
        icon: Disc,
        tooltipContent: "Start Screen Recording"
      },
      {
        onClick: async () => screenActions.stopRecording(),
        disabled: !screenState.recording,
        icon: StopCircle,
        tooltipContent: "Stop Screen Recording"
      },
      {
        onClick: async () => screenActions.takePicture(),
        disabled: !isStreamActive,
        icon: Camera,
        tooltipContent: "Take Screen Picture"
      }
    ];
  }, [screenState, screenActions]);

  useEffect(() => {
    if (typeof window !== "undefined" && screenState.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: screenState.error ?? "Screen Capture is not supported",
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
  }, [screenState.error]);

  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    await action();
    setIsLoading(false);
  };

  return (
    <MediaCard
      title="Screen Capture"
      description={`Permission granted: ${screenState.granted ? "Yes" : "No"}`}
      controls={buttons.map((button, index) => (
        <ScreenButton
          key={index + 1}
          onClick={() => handleAction(button.onClick)}
          disabled={button.disabled || isLoading}
          icon={button.icon}
          tooltipContent={button.tooltipContent}
        />
      ))}
      content={
        screenState.screen.stream ? (
          <video
            ref={(videoRef) => {
              if (videoRef) videoRef.srcObject = screenState.screen.stream;
            }}
            autoPlay
            muted
            className="w-full rounded-lg"
          >
            <track kind="captions" />
          </video>
        ) : (
          <strong className="flex h-48 w-full items-center justify-center rounded-lg border-gray-100 bg-gray-200 text-black">
            Screen off
          </strong>
        )
      }
      isLoading={isLoading}
    />
  );
};
