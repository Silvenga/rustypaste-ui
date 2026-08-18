import { getLogger } from "@logtape/logtape";
import { useCallback, useState } from "react";
import type { ComponentProps } from "react";
import { FiLink, FiCheck } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

const logger = getLogger(["rustypaste-ui", "CopyLinkButton"]);

type CopyLinkButtonProps = ComponentProps<typeof Button> & {
  text: string;
};

export function CopyLinkButton({ text, className, ...props }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const run = useCallback(async () => {
    try {
      await copy(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1_000);
    } catch {
      logger.error("Failed to copy link");
    }
  }, [text]);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className={twMerge("px-2", className)} onClick={run} {...props}>
          {copied ? <FiCheck /> : <FiLink />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : "Copy link to your clipboard"}</TooltipContent>
    </Tooltip>
  );
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    logger.error("Failed to copy to clipboard", { error });
    throw error;
  }
}
