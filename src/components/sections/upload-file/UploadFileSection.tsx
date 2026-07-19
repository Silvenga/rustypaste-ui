import { UploadDropzone } from "@/components/sections/upload-file/UploadDropzone.tsx";
import { UploadList } from "@/components/sections/upload-file/UploadList.tsx";
import { useFileUploads } from "@/components/sections/upload-file/useFileUploads.ts";

export function UploadFileSection() {
  const { files, uploadFile, removeFile } = useFileUploads();
  return (
    <div className="mt-4 flex flex-col gap-4">
      <UploadDropzone uploadFile={uploadFile} />
      <UploadList files={files} removeFile={removeFile} />
    </div>
  );
}
