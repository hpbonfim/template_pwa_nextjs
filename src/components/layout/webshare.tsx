"use client";
import { useEffect } from "react";

import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWebShare } from "@/hooks/useWebShare";

import { ToastAction } from "../ui/toast";

const WebShare: React.FC = () => {
  const webShare = useWebShare();
  const { toast } = useToast();

  const handleShare = () => {
    webShare.share({
      title: "PWA Template",
      text: "Check out this PWA Template!",
      url: window.location.href
    });
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      webShare.isSupported !== null &&
      webShare.isSupported === false
    ) {
      console.log("Web Share API is not supported");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          webShare.error?.message ?? "Web Share API is not supported",
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
  }, [webShare.isSupported, webShare.error, toast]);

  return (
    <Button
      onClick={handleShare}
      disabled={!webShare.isSupported}
      variant="ghost"
      size="icon"
      className="size-[1.2rem] w-9 px-0"
    >
      <Share2 />
    </Button>
  );
};

export default WebShare;
