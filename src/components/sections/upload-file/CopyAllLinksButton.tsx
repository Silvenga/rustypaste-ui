import { useCallback, useMemo, useState } from "react";
import type { UploadState } from "@/components/sections/upload-file/useFileUploads.ts";
import { Button } from "@/components/ui/button.tsx";

type CopyAllLinksButtonProps = {
  files: UploadState[];
};

export function CopyAllLinksButton({ files }: CopyAllLinksButtonProps) {
  const [copied, setCopied] = useState(false);

  const urls = useMemo(
    () =>
      files
        .filter(
          (file): file is Extract<UploadState, { state: "uploaded" }> => file.state === "uploaded",
        )
        .map((file) => file.url),
    [files],
  );

  const onClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(urls.join("\n"));
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1_000);
    } catch (error) {
      console.error("Failed to copy to clipboard", error);
    }
  }, [urls]);

  return urls.length === 0 ? null : (
    <Button variant="ghost" size="sm" onClick={onClick}>
      {copied ? "Copied!" : `Copy ${urls.length.toLocaleString()} Links`}
    </Button>
  );
}
