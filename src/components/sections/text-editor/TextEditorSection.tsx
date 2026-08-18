import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState, useRef } from "react";
import { uploadFile } from "@/api/uploadFile.ts";
import { useAuth } from "@/components/useAuth.ts";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineErrorOutline } from "react-icons/md";
import { SyntaxHighlightEditor } from "@/components/sections/text-editor/SyntaxHighlightEditor.tsx";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton.tsx";

export function TextEditorSection() {
  const [text, setText] = useState("");
  const [editingFile, setEditingFile] = useState<{ name: string; url: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [customFileName, setCustomFileName] = useState("");
  const [expire, setExpire] = useState("");
  const [oneShot, setOneShot] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { authKey } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load file for editing if coming from Edit button
  useEffect(() => {
    const editFileData = sessionStorage.getItem('editFile');
    if (editFileData) {
      try {
        const { name, content, url } = JSON.parse(editFileData);
        setText(content);
        setEditingFile({ name, url });
        setCustomFileName(name);
        sessionStorage.removeItem('editFile');
      } catch (e) {
        console.error("Failed to load edit file", e);
      }
    }
  }, []);

  const handleUpload = async () => {
    if (!text.trim()) return;

    setIsUploading(true);
    setUploadedUrl(null);
    setUploadError(null);

    // Create abort controller for this upload
    abortControllerRef.current = new AbortController();

    try {
      // Create a file from the text content
      const blob = new Blob([text], { type: "text/plain" });
      const fileName = customFileName.trim() || (editingFile ? editingFile.name : "paste.txt");
      const file = new File([blob], fileName, { type: "text/plain" });

      const url = await uploadFile({
        file,
        token: authKey.token,
        instanceUrl: authKey.instanceUrl,
        signal: abortControllerRef.current.signal,
        onProgress: () => {},
        fileName: customFileName.trim() || undefined,
        expire: expire.trim() || undefined,
        oneShot: oneShot,
      });

      setUploadedUrl(url);

      // Clear editing state after successful upload
      if (editingFile) {
        setEditingFile(null);
      }
    } catch (e: any) {
      if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') {
        console.log("Upload canceled");
      } else {
        console.error("Upload failed", e);
        if (e.response?.status === 409) {
          setUploadError("File with this name already exists. Please rename the file.");
        } else {
          setUploadError(`Upload failed: ${e.message || 'Unknown error'}`);
        }
      }
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setEditingFile(null);
    setUploadedUrl(null);
    setCustomFileName("");
    setExpire("");
    setOneShot(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const lineCount = text.split('\n').length;
  const charCount = text.length;

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-background flex flex-col p-4" : "mt-4 flex flex-col gap-4"}>
      <Card className={isFullscreen ? "flex flex-col h-full p-4" : "p-4 max-w-5xl mx-auto w-full"}>
        <div className="flex items-center justify-between mb-2 flex-shrink-0">
          <div className="flex items-center gap-4">
            {editingFile && (
              <div className="text-sm text-muted-foreground">
                Editing: <span className="font-mono">{editingFile.name}</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Lines: {lineCount} | Characters: {charCount}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFullscreen}
            className="p-2"
          >
            {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
          </Button>
        </div>

        <div className={isFullscreen ? "flex-1 min-h-0 mb-4" : "mb-4"}>
          <SyntaxHighlightEditor
            value={text}
            onChange={setText}
            fileName={customFileName || editingFile?.name}
            isFullscreen={isFullscreen}
          />
        </div>

        {uploadedUrl && (
          <div className="mb-2 relative flex items-center border text-sm rounded-md flex-wrap outline-none transition-colors duration-100 p-4 gap-4 flex-shrink-0">
            <div className="flex w-full flex-1 flex-col gap-1 overflow-hidden">
              <div className="flex w-full items-center gap-2">
                <div><IoIosCheckmarkCircleOutline className="size-6" /></div>
                <div className="me-4 truncate text-sm leading-snug font-medium">Text uploaded successfully</div>
              </div>
              <div className="text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance">
                <div className="flex flex-col items-center gap-2 p-1 sm:flex-row">
                  <Input type="text" value={uploadedUrl} readOnly aria-label="File Link" />
                  <CopyLinkButton text={uploadedUrl} />
                </div>
              </div>
            </div>
          </div>
        )}

        {uploadError && (
          <div className="mb-2 relative flex items-center border text-sm rounded-md flex-wrap outline-none transition-colors duration-100 p-4 gap-4 flex-shrink-0">
            <div className="flex w-full flex-1 flex-col gap-1 overflow-hidden">
              <div className="flex w-full items-center gap-2">
                <div><MdOutlineErrorOutline className="size-6 text-red-600" /></div>
                <div className="me-4 truncate text-sm leading-snug font-medium">Upload failed</div>
              </div>
              <div className="text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance">
                <span className="text-xs text-red-600">Error: {uploadError}</span>
              </div>
            </div>
          </div>
        )}

        {/* Upload options - stacked vertically */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          <div className="flex flex-col gap-2">
            <Label htmlFor="filename">Custom Filename (optional)</Label>
            <Input
              id="filename"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              placeholder="my-file.txt"
              className="font-mono text-sm"
              disabled={isUploading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="expire">Expiration (optional)</Label>
            <Input
              id="expire"
              value={expire}
              onChange={(e) => setExpire(e.target.value)}
              placeholder="10min, 1h, 1d, etc."
              className="font-mono text-sm"
              disabled={isUploading}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="oneshot"
              checked={oneShot}
              onCheckedChange={(checked) => setOneShot(checked === true)}
              disabled={isUploading}
            />
            <Label htmlFor="oneshot" className="text-sm cursor-pointer">
              One-shot (delete after first view)
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isUploading}
            >
              Clear
            </Button>
            {isUploading ? (
              <Button
                variant="destructive"
                onClick={handleCancelUpload}
              >
                Cancel Upload
              </Button>
            ) : (
              <Button
                onClick={handleUpload}
                disabled={!text.trim()}
              >
                {editingFile ? "Update File" : "Upload Text"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
