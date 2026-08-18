import { getLogger } from "@logtape/logtape";
import type { CellContext } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { FiCopy, FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteFile } from "@/api/deleteFile.ts";
import { getFile } from "@/api/getFile.ts";
import type { ListItem } from "@/api/getList.ts";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { useAuth } from "@/components/useAuth.ts";
import { uploadFile } from "@/api/uploadFile.ts";

const logger = getLogger(["rustypaste-ui", "ActionsCell"]);

type ActionsCellProps = CellContext<ListItem, unknown>;

export function ActionsCell({ row }: ActionsCellProps) {
  const url = row.original.url;
  const name = row.original.fileName;
  const isTextFile = isEditableTextFile(name);

  return (
    <div className="flex items-center justify-end gap-2">
      <CopyLinkButton size="sm" className="p-0" text={url} />
      {isTextFile && (
        <>
          <EditButton url={url} name={name} />
          <DuplicateButton url={url} name={name} />
        </>
      )}
      <DeleteButton name={name} />
    </div>
  );
}

function isEditableTextFile(fileName: string): boolean {
  const textExtensions = ['.txt', '.md', '.json', '.js', '.ts', '.tsx', '.jsx', '.css', '.html', '.xml', '.yml', '.yaml', '.conf', '.ini', '.log', '.sh', '.py', '.rb', '.java', '.c', '.cpp', '.h', '.go', '.rs', '.php'];

  // Check if file has a known text extension
  if (textExtensions.some(ext => fileName.toLowerCase().endsWith(ext))) {
    return true;
  }

  // If file has no extension (no dot in filename), consider it editable
  if (!fileName.includes('.')) {
    return true;
  }

  return false;
}

function EditButton({ url, name }: { url: string; name: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const content = await getFile({ url });
      // Store in sessionStorage and navigate to text editor
      sessionStorage.setItem('editFile', JSON.stringify({ name, content, url }));
      window.location.hash = 'text';
    } catch (e) {
      logger.error("Failed to load file for editing", { error: e });
    } finally {
      setIsLoading(false);
    }
  }, [url, name]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          className="px-2"
          variant="outline"
          onClick={onClick}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <FiEdit2 />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isLoading ? "Loading..." : "Edit text file"}
      </TooltipContent>
    </Tooltip>
  );
}

function DuplicateButton({ url, name }: { url: string; name: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { authKey } = useAuth();

  const onClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const content = await getFile({ url });
      const blob = new Blob([content], { type: "text/plain" });

      // Generate new filename with copy suffix
      const nameParts = name.split('.');
      const newName = nameParts.length > 1
        ? `${nameParts.slice(0, -1).join('.')}-copy.${nameParts[nameParts.length - 1]}`
        : `${name}-copy`;

      const file = new File([blob], newName, { type: "text/plain" });

      await uploadFile({
        file,
        token: authKey.token,
        instanceUrl: authKey.instanceUrl,
        signal: undefined,
        onProgress: () => {},
        fileName: undefined,
        expire: undefined,
        oneShot: false,
      });
    } catch (e) {
      logger.error("Failed to duplicate file", { error: e });
    } finally {
      setIsLoading(false);
    }
  }, [url, name, authKey]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          className="px-2"
          variant="outline"
          onClick={onClick}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <FiCopy />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isLoading ? "Duplicating..." : "Duplicate file"}
      </TooltipContent>
    </Tooltip>
  );
}

function DeleteButton({ name }: { name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { authKey } = useAuth();
  const onClick = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteFile({
        token: authKey.token,
        instanceUrl: authKey.instanceUrl,
        name,
      });
    } catch (e) {
      logger.error("Failed to delete file", { error: e });
    }
  }, [authKey.instanceUrl, authKey.token, name]);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          className="px-2"
          variant="outline"
          onClick={onClick}
          disabled={isDeleting}
        >
          {isDeleting ? <Spinner /> : <FiTrash2 />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isDeleting ? "Deleting..." : "Permanently remove file from server."}
      </TooltipContent>
    </Tooltip>
  );
}
