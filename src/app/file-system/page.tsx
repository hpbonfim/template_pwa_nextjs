"use client";

import React, { useState, useEffect } from "react";

import {
  Folder,
  File,
  Trash2,
  RefreshCw,
  Eye,
  Edit2,
  X,
  AlertTriangle,
  Plus
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useFileSystem } from "@/hooks/useFileSystem";
import { useNavigator } from "@/hooks/useNavigation";

// Types with proper documentation
interface FileSystemHandler {
  name: string;
  handle: FileSystemHandle;
  lastModified?: number;
}

interface File {
  name: string;
  content: string;
}

const DirectorySelector: React.FC<{
  isLoading: boolean;
  onSelect: () => void;
}> = ({ isLoading, onSelect }) => (
  <Card className="m-auto mt-8 max-w-md">
    <CardHeader>
      <CardTitle>File System Access</CardTitle>
      <CardDescription>
        Select a directory to manage your files securely.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Alert className="mb-4 flex flex-col">
        <AlertTriangle className="size-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          This application requires access to your file system. Please be
          careful when granting access and only select directories you trust.
        </AlertDescription>
        <Button
          onClick={onSelect}
          disabled={isLoading}
          className="mx-auto mt-4 w-2/4"
        >
          {isLoading ? (
            <RefreshCw className="mr-2 size-4 animate-spin" />
          ) : (
            <Folder className="mr-2 size-4" />
          )}
          Select Directory
        </Button>
      </Alert>
    </CardContent>
  </Card>
);

const FileRow: React.FC<{
  file: FileSystemHandler;
  isMobile: boolean;
  onPreview: (fileName: string) => void;
  onEdit: (fileName: string) => void;
  onDelete: () => Promise<void>;
}> = ({ file, isMobile, onPreview, onEdit, onDelete }) => (
  <TableRow>
    <TableCell className="font-medium">
      <div className="flex items-center">
        <File className="mr-2 size-4" />
        {file.name}
      </div>
    </TableCell>
    {!isMobile && (
      <TableCell>
        {file.lastModified
          ? new Date(file.lastModified).toLocaleDateString()
          : "-"}
      </TableCell>
    )}
    <TableCell className="text-right">
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPreview(file.name)}
          aria-label={`Preview ${file.name} `}
        >
          <Eye className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(file.name)}
          aria-label={`Edit ${file.name} `}
        >
          <Edit2 className="size-4" />
        </Button>
        <DeleteFileButton fileName={file.name} onDelete={onDelete} />
      </div>
    </TableCell>
  </TableRow>
);

const DeleteFileButton: React.FC<{
  fileName: string;
  onDelete: () => Promise<void>;
}> = ({ fileName, onDelete }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="ghost" size="sm" aria-label={`Delete ${fileName} `}>
        <Trash2 className="size-4" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete {fileName}?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onDelete}
          className="bg-destructive hover:bg-destructive/90"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const ClearDirectoryButton: React.FC<{
  disabled: boolean;
  onClear: () => Promise<void>;
}> = ({ disabled, onClear }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="destructive" size="sm" disabled={disabled}>
        Clear All
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Clear entire directory?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete all files
          from your directory.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onClear}
          className="bg-destructive hover:bg-destructive/90"
        >
          Delete All
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const FilePreviewDialog: React.FC<{
  file: File | null;
  onClose: () => void;
}> = ({ file, onClose }) => (
  <Dialog open={!!file} onOpenChange={() => onClose()}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{file?.name}</DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        <pre className="max-h-[500px] overflow-auto rounded-lg bg-muted p-4">
          {file?.content}
        </pre>
      </div>
    </DialogContent>
  </Dialog>
);

const FileEditDialog: React.FC<{
  file: File | null;
  fileName: string;
  isNew: boolean;
  onFileNameChange: (name: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
}> = ({
  file,
  fileName,
  isNew,
  onFileNameChange,
  onContentChange,
  onSave,
  onClose
}) => (
  <Dialog open={!!file || isNew} onOpenChange={() => onClose()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isNew ? "Create File" : "Edit File"}</DialogTitle>
        <DialogDescription>
          {isNew ? "Create a new file" : "Make changes to your file content."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input
          value={fileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          placeholder="File name"
          aria-label="File name"
        />
        <Textarea
          value={file?.content || ""}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="File contents"
          className="min-h-[200px]"
          aria-label="File contents"
        />
      </div>
      <DialogFooter>
        <Button onClick={onSave}>
          {isNew ? "Create file" : "Save changes"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default function Page() {
  // Add proper aria-labels and roles for accessibility
  const {
    directoryHandle,
    error,
    requestDirectory,
    closeDirectory,
    createFile,
    getFile,
    updateFile,
    listFiles,
    deleteFile,
    clearDirectory
  } = useFileSystem();

  const [files, setFiles] = useState<FileSystemHandler[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const [createNewFile, setCreateNewFile] = useState<boolean>(false);
  const { isMobile } = useNavigator();

  // Effect for initial load and periodic refresh
  useEffect(() => {
    if (directoryHandle) {
      refreshFileList();
    }
  }, [directoryHandle]);

  // Debounced refresh function
  const refreshFileList = async () => {
    try {
      setIsLoading(true);
      const fileList = await listFiles();
      setFiles(fileList);
    } catch (err) {
      console.error("Error refreshing files:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // File handlers with proper error handling
  const handlePreviewFile = async (fileName: string) => {
    try {
      setIsLoading(true);
      const content = await getFile(fileName);
      if (content) {
        setSelectedFile({ name: fileName, content });
      }
    } catch (err) {
      console.error("Error previewing file:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFile = async () => {
    if (!newFileName) return;
    try {
      setIsLoading(true);
      await createFile(newFileName, editFile?.content || "");
      await refreshFileList();
      setCreateNewFile(false);
      setNewFileName("");
      setEditFile(null);
    } catch (err) {
      console.error("Error creating file:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFile = async () => {
    if (!editFile) return;
    try {
      setIsLoading(true);
      await updateFile(editFile.name, newFileName, editFile.content);
      await refreshFileList();
      setEditFile(null);
      setNewFileName("");
    } catch (err) {
      console.error("Error updating file:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto space-y-4 p-4" role="main">
      {/* Header Section */}
      <header className="mb-6 flex items-center justify-between">
        <div className="m-auto flex items-center space-x-2">
          {directoryHandle ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Directory: {directoryHandle.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={closeDirectory}
                aria-label="Close directory"
              >
                <X className="mr-2 size-4" />
                Close Directory
              </Button>
            </div>
          ) : (
            <DirectorySelector
              isLoading={isLoading}
              onSelect={requestDirectory}
            />
          )}
        </div>

        {directoryHandle && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={refreshFileList}
              disabled={isLoading}
              aria-label="Refresh file list"
            >
              <RefreshCw
                className={`mr - 2 size - 4 ${isLoading ? "animate-spin" : ""} `}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => setCreateNewFile(true)}
              disabled={isLoading}
              aria-label="Create new file"
            >
              <Plus className="mr-2 size-4" />
              New File
            </Button>
            <ClearDirectoryButton
              disabled={files.length === 0}
              onClear={async () => {
                await clearDirectory();
                await refreshFileList();
              }}
            />
          </div>
        )}
      </header>

      {/* File Table Section */}
      {directoryHandle && (
        <div className="rounded-md border" role="region" aria-label="File list">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className={isMobile ? "hidden" : ""}>
                  Last Modified
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <FileRow
                  key={file.name}
                  file={file}
                  isMobile={isMobile}
                  onPreview={handlePreviewFile}
                  onEdit={(fileName) => {
                    // handleEditFile(fileName);
                    setNewFileName(fileName);
                  }}
                  onDelete={async () => {
                    await deleteFile(file.name);
                    await refreshFileList();
                  }}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialogs */}
      <FilePreviewDialog
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
      />

      <FileEditDialog
        file={editFile}
        fileName={newFileName}
        isNew={createNewFile}
        onFileNameChange={setNewFileName}
        onContentChange={(content) =>
          setEditFile((prev) => (prev ? { ...prev, content } : null))
        }
        onSave={createNewFile ? handleCreateFile : handleUpdateFile}
        onClose={() => {
          setEditFile(null);
          setNewFileName("");
          setCreateNewFile(false);
        }}
      />

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" role="alert" aria-live="assertive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </main>
  );
}
