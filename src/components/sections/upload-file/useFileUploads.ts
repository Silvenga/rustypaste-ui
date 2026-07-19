import { getLogger } from "@logtape/logtape";
import { useCallback, useMemo, useReducer } from "react";
import { uploadFile } from "@/api/uploadFile.ts";
import { useAuth } from "@/components/useAuth.ts";

const logger = getLogger(["rustypaste-ui", "useFileUploads"]);

export function useFileUploads() {
  const { authKey } = useAuth();
  const [state, dispatch] = useReducer(reducer, defaultState);

  const executeUploadFile = useCallback(
    async (file: File) => {
      const id = getNextId();
      const abortController = new AbortController();
      dispatch({ type: "accept-file", file, id, abort: abortController });
      try {
        const url = await uploadFile({
          file,
          token: authKey.token,
          instanceUrl: authKey.instanceUrl,
          signal: abortController.signal,
          onProgress: (progress, rate, estimated) => {
            dispatch({
              type: "file-progressed",
              id,
              progress,
              bytesPerSecond: rate,
              estimatedSecondsRemaining: estimated,
            });
          },
          // TODO
          fileName: undefined,
          expire: undefined,
          oneShot: false,
        });
        dispatch({ type: "file-uploaded", id, url });
      } catch (e) {
        logger.warn("File upload failed", { error: e });
        if (e instanceof Error) {
          dispatch({ type: "file-errored", id, error: e.message });
        } else {
          dispatch({ type: "file-errored", id, error: "Unknown error" });
        }
      }
    },
    [authKey],
  );

  const removeFile = useCallback((id: number) => {
    dispatch({ type: "remove-upload", id });
  }, []);

  return useMemo(
    () => ({
      files: state.files,
      uploadFile: executeUploadFile,
      removeFile,
    }),
    [state, executeUploadFile, removeFile],
  );
}

type State = {
  files: ReadonlyArray<UploadState>;
};

export type UploadState =
  | { state: "queued"; id: number; file: File; abort: AbortController }
  | {
      state: "uploading";
      id: number;
      file: File;
      abort: AbortController;
      progress: number;
      estimatedSecondsRemaining: number | undefined;
      bytesPerSecond: number | undefined;
    }
  | { state: "errored"; id: number; file: File; progress: number; error: string }
  | { state: "uploaded"; id: number; file: File; url: string }
  | { state: "canceled"; id: number; file: File };

const defaultState = { files: [] };

type Action =
  | { type: "accept-file"; id: number; file: File; abort: AbortController }
  | { type: "cancel-file"; id: number }
  | {
      type: "file-progressed";
      id: number;
      progress: number;
      estimatedSecondsRemaining: number | undefined;
      bytesPerSecond: number | undefined;
    }
  | { type: "file-errored"; id: number; error: string }
  | { type: "file-uploaded"; id: number; url: string }
  | { type: "remove-upload"; id: number };

function reducer(state: State, action: Action): State {
  logger.debug("dispatch", action);
  switch (action.type) {
    case "accept-file":
      return {
        ...state,
        files: [
          {
            state: "queued",
            id: action.id,
            file: action.file,
            abort: action.abort,
          } satisfies UploadState,
          ...state.files,
        ],
      };
    case "cancel-file": {
      const file = state.files.find((x) => x.id === action.id);
      if (file && (file.state === "uploading" || file.state === "queued")) {
        file.abort.abort("canceled by user");
        return {
          ...state,
          files: state.files.map((x) => {
            if (x.id === action.id) {
              return {
                state: "canceled",
                id: x.id,
                file: x.file,
              } satisfies UploadState;
            }
            return x;
          }),
        };
      }
      break;
    }
    case "file-progressed":
      return {
        ...state,
        files: state.files.map((x) => {
          if (x.id === action.id && (x.state === "queued" || x.state === "uploading")) {
            return {
              state: "uploading",
              id: x.id,
              file: x.file,
              abort: x.abort,
              progress: action.progress,
              bytesPerSecond: action.bytesPerSecond,
              estimatedSecondsRemaining: action.estimatedSecondsRemaining,
            } satisfies UploadState;
          }
          return x;
        }),
      };
    case "file-errored":
      return {
        ...state,
        files: state.files.map((x) => {
          if (x.id === action.id && (x.state === "queued" || x.state === "uploading")) {
            return {
              state: "errored",
              id: x.id,
              file: x.file,
              progress: x.state === "uploading" ? x.progress : 0,
              error: action.error,
            } satisfies UploadState;
          }
          return x;
        }),
      };
    case "file-uploaded":
      return {
        ...state,
        files: state.files.map((x) => {
          if (x.id === action.id && (x.state === "queued" || x.state === "uploading")) {
            return {
              state: "uploaded",
              id: x.id,
              file: x.file,
              url: action.url,
            } satisfies UploadState;
          }
          return x;
        }),
      };
    case "remove-upload":
      return {
        ...state,
        files: state.files.filter((x) => x.id !== action.id),
      };
  }
  return state;
}

let nextId = 0;

function getNextId() {
  return nextId++;
}
