import { useCallback, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { Button, type ButtonProps } from "@/components/ui/button.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

type CopyLinkButtonProps = ButtonProps & {
  text: string;
};

export function CopyLinkButton({ text, className, ...props }: CopyLinkButtonProps) {
  const DEFAULT = "Copy";
  const COPIED = "Copied!";
  const [buttonText, setButtonText] = useState(DEFAULT);
  const run = useCallback(async () => {
    try {
      await copy(text);
    } catch {
      setButtonText("Error!");
    }
    setButtonText(COPIED);
    setTimeout(() => {
      setButtonText(DEFAULT);
    }, 1_000);
  }, [text]);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className={twMerge("relative flex", className)} onClick={run} {...props}>
          <div className="flex items-center justify-center gap-1 opacity-0" aria-hidden>
            <FaRegCopy />
            {COPIED}
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            {buttonText === DEFAULT && <FaRegCopy />}
            {buttonText}
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy link to your clipboard.</TooltipContent>
    </Tooltip>
  );
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Failed to copy to clipboard, ", error);
    throw error;
  }
}
