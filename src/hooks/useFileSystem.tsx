import { useState, useCallback } from "react";

type FileHandle = FileSystemFileHandle | null;
interface DirectoryHandle extends FileSystemDirectoryHandle {
  entries: () => AsyncIterableIterator<[string, FileSystemHandle]>;
}

interface UseFileSystemReturn {
  directoryHandle: DirectoryHandle | null;
  fileHandle: FileHandle | null;
  error: string | null;
  requestDirectory: () => Promise<void>;
  closeDirectory: () => void;
  createDirectory: (dirName?: string) => Promise<void>;
  createFile: (fileName: string, contents: string) => Promise<void>;
  getFile: (fileName: string) => Promise<string | null>;
  updateFile: (
    fileName: string,
    newName: string,
    contents: string
  ) => Promise<void>;
  listFiles: () => Promise<
    { name: string; handle: FileSystemHandle; lastModified?: number }[]
  >;
  deleteFile: (fileName: string) => Promise<void>;
  clearDirectory: () => Promise<void>;
}

export const useFileSystem = (): UseFileSystemReturn => {
  const [directoryHandle, setDirectoryHandle] =
    useState<DirectoryHandle | null>(null);
  const [fileHandle, setFileHandle] = useState<FileHandle>(null);
  const [error, setError] = useState<string | null>(null);

  const isFileSystemSupported =
    typeof window !== "undefined" && "showDirectoryPicker" in window;

  const requestDirectory = useCallback(async (): Promise<void> => {
    if (!isFileSystemSupported) {
      setError("File System Access API is not supported in this browser.");
      return;
    }
    try {
      const handle = await window.showDirectoryPicker();
      setDirectoryHandle(handle as DirectoryHandle);
      setError(null);
    } catch (err) {
      setError(
        "Error requesting directory handle: " +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }, [isFileSystemSupported]);

  const closeDirectory = useCallback(() => {
    setDirectoryHandle(null);
    setFileHandle(null);
    setError(null);
  }, []);

  const ensureDirectoryHandle = useCallback(async (): Promise<boolean> => {
    if (!directoryHandle) {
      await requestDirectory();
    }
    return !!directoryHandle;
  }, [directoryHandle, requestDirectory]);

  const createDirectory = useCallback(
    async (dirName: string = "files"): Promise<void> => {
      if (!(await ensureDirectoryHandle())) return;
      try {
        const dirHandle = await directoryHandle!.getDirectoryHandle(dirName, {
          create: true
        });
        setDirectoryHandle(dirHandle as DirectoryHandle);
        setError(null);
      } catch (err) {
        setError(
          "Error creating directory: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
    },
    [directoryHandle, ensureDirectoryHandle]
  );

  const createFile = useCallback(
    async (fileName: string, contents: string): Promise<void> => {
      if (!(await ensureDirectoryHandle())) return;
      try {
        const handle = await directoryHandle!.getFileHandle(fileName, {
          create: true
        });
        const writable = await handle.createWritable();
        await writable.write(contents);
        await writable.close();
        setFileHandle(handle);
        setError(null);
      } catch (err) {
        setError(
          "Error creating file: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
    },
    [directoryHandle, ensureDirectoryHandle]
  );

  const getFile = useCallback(
    async (fileName: string): Promise<string | null> => {
      if (!(await ensureDirectoryHandle())) return null;
      try {
        const handle = await directoryHandle!.getFileHandle(fileName);
        const file = await handle.getFile();
        const contents = await file.text();
        setFileHandle(handle);
        setError(null);
        return contents;
      } catch (err) {
        setError(
          "Error getting file: " +
            (err instanceof Error ? err.message : String(err))
        );
        return null;
      }
    },
    [directoryHandle, ensureDirectoryHandle]
  );

  const listFiles = useCallback(async (): Promise<
    { name: string; handle: FileSystemHandle }[]
  > => {
    if (!(await ensureDirectoryHandle())) return [];
    try {
      const files: { name: string; handle: FileSystemHandle }[] = [];
      for await (const [name, handle] of directoryHandle!.entries()) {
        files.push({ name, handle });
      }
      setError(null);
      return files;
    } catch (err) {
      setError(
        "Error listing files: " +
          (err instanceof Error ? err.message : String(err))
      );
      return [];
    }
  }, [directoryHandle, ensureDirectoryHandle]);

  const deleteFile = useCallback(
    async (fileName: string): Promise<void> => {
      if (!(await ensureDirectoryHandle())) return;
      try {
        await directoryHandle!.removeEntry(fileName);
        setError(null);
      } catch (err) {
        setError(
          "Error deleting file: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
    },
    [directoryHandle, ensureDirectoryHandle]
  );

  const clearDirectory = useCallback(async (): Promise<void> => {
    if (!(await ensureDirectoryHandle())) return;
    try {
      for await (const [name] of directoryHandle!.entries()) {
        await directoryHandle!.removeEntry(name);
      }
      setError(null);
    } catch (err) {
      setError(
        "Error clearing directory: " +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }, [directoryHandle, ensureDirectoryHandle]);

  const updateFile = useCallback(
    async (
      fileName: string,
      newName: string,
      contents: string
    ): Promise<void> => {
      if (!(await ensureDirectoryHandle())) return;
      try {
        if (fileName !== newName) {
          await createFile(newName, contents);
          await deleteFile(fileName);
        } else {
          await createFile(fileName, contents);
        }
        setError(null);
      } catch (err) {
        setError(
          "Error updating file: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
    },
    [createFile, deleteFile, ensureDirectoryHandle]
  );

  return {
    directoryHandle,
    fileHandle,
    error,
    requestDirectory,
    closeDirectory,
    createDirectory,
    createFile,
    getFile,
    updateFile,
    listFiles,
    deleteFile,
    clearDirectory
  };
};
