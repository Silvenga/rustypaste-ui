import axios from "axios";

type UploadFileArgs = {
  file: File;
  authToken: string;
  instanceUrl: string;
  onProgress: (progress: number, rate?: number, estimated?: number) => void;
  expire: string | undefined;
  oneShot: boolean;
  fileName: string | undefined;
  signal?: AbortSignal;
};

export async function uploadFile(args: UploadFileArgs) {
  const form = new FormData();
  form.append(args.oneShot ? "oneshot" : "file", args.file);
  const result = await axios.postForm(args.instanceUrl, form, {
    responseType: "text",
    headers: {
      authorization: args.authToken,
      filename: args.fileName,
      expire: args.expire,
    },
    signal: args.signal,
    onUploadProgress: (progressEvent) => {
      args.onProgress(progressEvent.progress ?? 0, progressEvent.rate, progressEvent.estimated);
    },
  });

  if (!(typeof result.data === "string")) {
    throw new Error("Unexpected response from server");
  }
  return result.data.trim();
}
