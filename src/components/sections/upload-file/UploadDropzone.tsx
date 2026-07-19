import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import { Card, CardContent } from "@/components/ui/card.tsx";

type UploadDropzoneProps = {
  uploadFile: (file: File) => Promise<void>;
};

export function UploadDropzone({ uploadFile }: UploadDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      for (const acceptedFile of acceptedFiles) {
        void uploadFile(acceptedFile);
      }
    },
    [uploadFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Card
      {...getRootProps()}
      className={twMerge(
        "border-dashed cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
        isDragActive && "bg-slate-100 border-slate-500 dark:bg-slate-800 dark:border-slate-600",
      )}
    >
      <CardContent className="flex h-32 flex-col items-center justify-center gap-2">
        <input {...getInputProps()} />
        <AiOutlineCloudUpload className="size-10" />
        <p className="text-center text-sm">
          {isDragActive ? (
            <>Drop & Drop files here...</>
          ) : (
            <>Drop & Drop or click to upload files.</>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
