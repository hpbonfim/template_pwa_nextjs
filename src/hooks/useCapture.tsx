import { useState, useRef, useCallback, useEffect } from "react";

import { DATABASE } from "@/constants";

import { useIndexedDB, type IDBDataItem } from "./useIndexedDB";

interface CameraStream {
  stream: MediaStream | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

interface CameraState {
  camera: CameraStream;
  recording: boolean;
  error: string | null;
  granted: boolean;
}

interface CameraActions {
  startCapture: () => Promise<void>;
  stopCapture: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  takePicture: () => void;
}

interface ScreenStream {
  stream: MediaStream | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

interface ScreenState {
  screen: ScreenStream;
  recording: boolean;
  error: string | null;
  granted: boolean;
}

interface ScreenActions {
  startCapture: () => Promise<void>;
  stopCapture: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  takePicture: () => void;
}

export interface IMediaFile extends IDBDataItem {
  timestamp: number;
  fileType: "image/jpeg" | "video/mp4" | "audio/mp3";
  fileName: string;
  data: Blob | MediaSource;
}

export const useMediaCamera = (): [CameraState, CameraActions] => {
  const [state, setState] = useState<CameraState>({
    camera: { stream: null, audioEnabled: true, videoEnabled: true },
    recording: false,
    error: null,
    granted: false
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { saveItem } = useIndexedDB<IMediaFile>(DATABASE.IDB_STORE_FILES);

  const updateState = (newState: Partial<CameraState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const startCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      updateState({
        camera: { stream, audioEnabled: true, videoEnabled: true },
        error: null,
        granted: true
      });
    } catch (err) {
      updateState({
        error:
          err instanceof Error ? err.message : "Failed to start camera capture",
        granted: false
      });
    }
  }, []);

  const stopCapture = useCallback(() => {
    const { stream } = state.camera;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      updateState({
        camera: { stream: null, audioEnabled: true, videoEnabled: true }
      });
    }
  }, [state.camera]);

  const toggleTrack = useCallback(
    (trackType: "audio" | "video") => {
      const { stream } = state.camera;
      if (stream) {
        const tracks =
          trackType === "audio"
            ? stream.getAudioTracks()
            : stream.getVideoTracks();
        const enabled = !state.camera[`${trackType}Enabled`];
        tracks.forEach((track) => (track.enabled = enabled));
        updateState({
          camera: { ...state.camera, [`${trackType}Enabled`]: enabled }
        });
      }
    },
    [state.camera]
  );

  const toggleAudio = useCallback(() => toggleTrack("audio"), [toggleTrack]);
  const toggleVideo = useCallback(() => toggleTrack("video"), [toggleTrack]);

  const startRecording = useCallback(() => {
    const { stream } = state.camera;
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/mp4" });
        const fileName = `camera_${Date.now()}.mp4`;
        await saveItem({
          id: crypto.randomUUID(),
          fileName,
          fileType: "video/mp4",
          timestamp: Date.now(),
          data: blob
        });
        chunksRef.current = [];
      };

      mediaRecorder.start();
      updateState({ recording: true });
    }
  }, [state.camera, saveItem]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.recording) {
      mediaRecorderRef.current.stop();
      updateState({ recording: false });
    }
  }, [state.recording]);

  const takePicture = useCallback(() => {
    const { stream } = state.camera;
    if (stream) {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const fileName = `camera_photo_${Date.now()}.jpeg`;
            await saveItem({
              id: crypto.randomUUID(),
              fileName,
              fileType: "image/jpeg",
              timestamp: Date.now(),
              data: blob
            });
          }
        }, "image/jpeg");
      };
    }
  }, [state.camera, saveItem]);

  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, [stopCapture]);

  return [
    state,
    {
      startCapture,
      stopCapture,
      toggleAudio,
      toggleVideo,
      startRecording,
      stopRecording,
      takePicture
    }
  ];
};

export const useMediaScreen = (): [ScreenState, ScreenActions] => {
  const [state, setState] = useState<ScreenState>({
    screen: { stream: null, audioEnabled: true, videoEnabled: true },
    recording: false,
    error: null,
    granted: false
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { saveItem } = useIndexedDB<IMediaFile>(DATABASE.IDB_STORE_FILES);

  const updateState = (newState: Partial<ScreenState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const startCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      updateState({
        screen: { stream, audioEnabled: true, videoEnabled: true },
        error: null,
        granted: true
      });
    } catch (err) {
      updateState({
        error:
          err instanceof Error ? err.message : "Failed to start screen capture",
        granted: false
      });
    }
  }, []);

  const stopCapture = useCallback(() => {
    const { stream } = state.screen;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      updateState({
        screen: { stream: null, audioEnabled: true, videoEnabled: true }
      });
    }
  }, [state.screen]);

  const toggleTrack = useCallback(
    (trackType: "audio" | "video") => {
      const { stream } = state.screen;
      if (stream) {
        const tracks =
          trackType === "audio"
            ? stream.getAudioTracks()
            : stream.getVideoTracks();
        const enabled = !state.screen[`${trackType}Enabled`];
        tracks.forEach((track) => (track.enabled = enabled));
        updateState({
          screen: { ...state.screen, [`${trackType}Enabled`]: enabled }
        });
      }
    },
    [state.screen]
  );

  const toggleAudio = useCallback(() => toggleTrack("audio"), [toggleTrack]);
  const toggleVideo = useCallback(() => toggleTrack("video"), [toggleTrack]);

  const startRecording = useCallback(() => {
    const { stream } = state.screen;
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/mp4" });
        const fileName = `screen_${Date.now()}.mp4`;
        await saveItem({
          id: crypto.randomUUID(),
          fileName,
          fileType: "video/mp4",
          timestamp: Date.now(),
          data: blob
        });
        chunksRef.current = [];
      };

      mediaRecorder.start();
      updateState({ recording: true });
    }
  }, [state.screen, saveItem]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.recording) {
      mediaRecorderRef.current.stop();
      updateState({ recording: false });
    }
  }, [state.recording]);

  const takePicture = useCallback(() => {
    const { stream } = state.screen;
    if (stream) {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const fileName = `screen_photo_${Date.now()}.jpeg`;
            await saveItem({
              id: crypto.randomUUID(),
              fileName,
              fileType: "image/jpeg",
              timestamp: Date.now(),
              data: blob
            });
          }
        }, "image/jpeg");
      };
    }
  }, [state.screen, saveItem]);

  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, [stopCapture]);

  return [
    state,
    {
      startCapture,
      stopCapture,
      toggleAudio,
      toggleVideo,
      startRecording,
      stopRecording,
      takePicture
    }
  ];
};
