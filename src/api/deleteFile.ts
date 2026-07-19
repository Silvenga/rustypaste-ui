import axios from "axios";

type DeleteFileArgs = {
  authToken: string;
  instanceUrl: string;
  signal?: AbortSignal;
  name: string;
};

export async function deleteFile(args: DeleteFileArgs) {
  await axios.delete(args.instanceUrl + "/" + args.name, {
    responseType: "text",
    headers: {
      authorization: args.authToken,
    },
    signal: args.signal,
  });
}
