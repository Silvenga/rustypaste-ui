import { filesize } from "filesize";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdOutlineErrorOutline } from "react-icons/md";
import { TbCancel } from "react-icons/tb";
import { twMerge } from "tailwind-merge";
import { CopyAllLinksButton } from "@/components/sections/upload-file/CopyAllLinksButton.tsx";
import type { UploadState } from "@/components/sections/upload-file/useFileUploads.ts";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

type UploadListProps = {
  files: readonly UploadState[];
  removeFile: (id: number) => void;
};

export function UploadList({ files, removeFile }: UploadListProps) {
  const queued = files.filter((f) => f.state === "queued" || f.state === "uploading");
  const completed = files.filter(
    (f) => f.state === "uploaded" || f.state === "errored" || f.state === "canceled",
  );

  return (
    <>
      <section>
        {queued.length > 0 && <h2 className="mb-1 font-medium">Queue</h2>}
        <ol>
          {queued.map((file) => (
            <UploadedItem key={file.id} upload={file} removeFile={removeFile} />
          ))}
        </ol>
      </section>
      <section>
        {queued.length > 0 && completed.length > 0 && (
          <h2 className="mb-1 font-medium">Completed</h2>
        )}
        <ol>
          {completed.map((file) => (
            <UploadedItem key={file.id} upload={file} removeFile={removeFile} />
          ))}
        </ol>
        <div className="mt-2 flex justify-center">
          <CopyAllLinksButton files={completed} />
        </div>
      </section>
    </>
  );
}

function UploadedItem({
  upload,
  removeFile,
}: {
  upload: UploadState;
  removeFile: (id: number) => void;
}) {
  // if (1 + 1 == 2) {
  //   upload = {
  //     ...upload,
  //     state: "queued",
  //     abort: new AbortController(),
  //   };
  // }

  return (
    <li
      className={twMerge(
        "mb-2",
        "relative flex items-center border text-sm rounded-md flex-wrap outline-none",
        "transition-colors duration-100",
        "p-4 gap-4",
      )}
    >
      <div className="flex w-full flex-1 flex-col gap-1 overflow-hidden">
        <div className="flex w-full items-center gap-2">
          <div>
            {(upload.state == "queued" || upload.state === "uploading") && (
              <Spinner className="size-6" />
            )}
            {upload.state == "uploaded" && <IoIosCheckmarkCircleOutline className="size-6" />}
            {upload.state == "canceled" && <TbCancel className="size-6" />}
            {upload.state == "errored" && <MdOutlineErrorOutline className="size-6 text-red-600" />}
          </div>
          <div className="me-4 truncate text-sm leading-snug font-medium">{upload.file.name}</div>
        </div>
        <div
          className={twMerge(
            "text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance",
          )}
        >
          {upload.state == "canceled" && <span className="text-slate-400">Canceled</span>}
          {upload.state == "errored" && (
            <span className="text-xs text-red-600">Error: {upload.error}</span>
          )}
          {upload.state == "uploaded" && (
            <div className="flex flex-col items-center gap-2 p-1 sm:flex-row">
              <Input type="text" value={upload.url} readOnly />
              <CopyLinkButton text={upload.url} />
            </div>
          )}
          {(upload.state == "uploading" || upload.state === "queued") && (
            <div className="flex flex-col">
              <div className="flex items-center">
                <Progress value={upload.state === "uploading" ? upload.progress * 100 : 0} />
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        upload.abort.abort("Canceled by user.");
                      }}
                      aria-label="Cancel in-progress upload"
                    >
                      <TbCancel />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cancel upload.</TooltipContent>
                </Tooltip>
              </div>
              {upload.state === "queued" && (
                <div className="flex flex-col text-xs">
                  <div>Queued...</div>
                  <div className="flex">{filesize(upload.file.size, { round: 1, pad: true })}</div>
                </div>
              )}
              {upload.state === "uploading" && (
                <div className="flex flex-col text-xs">
                  <div>
                    {upload.bytesPerSecond
                      ? filesize(upload.bytesPerSecond, {
                          bits: true,
                          standard: "jedec",
                          round: 1,
                          pad: true,
                        }) + "/s"
                      : "Starting..."}
                    {!!upload.estimatedSecondsRemaining && (
                      <>, {Math.round(upload.estimatedSecondsRemaining)} seconds remaining</>
                    )}
                  </div>
                  <div className="flex">
                    {filesize(upload.progress * upload.file.size, { round: 1, pad: true })}
                    <span className="mx-1">of</span>
                    {filesize(upload.file.size, { round: 1, pad: true })} uploaded
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {(upload.state === "canceled" ||
        upload.state === "errored" ||
        upload.state === "uploaded") && (
        <div className="absolute top-1 right-1">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-60 hover:opacity-100"
                onClick={() => {
                  removeFile(upload.id);
                }}
                aria-label="Remove from list"
              >
                <IoClose />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove up from this list.</TooltipContent>
          </Tooltip>
        </div>
      )}
    </li>
  );
}
