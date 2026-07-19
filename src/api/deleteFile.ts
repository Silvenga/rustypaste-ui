import axios from "axios";

type DeleteFileArgs = {
  token: string;
  instanceUrl: string;
  signal?: AbortSignal;
  name: string;
};

export async function deleteFile(args: DeleteFileArgs) {
  await axios.delete(args.instanceUrl + "/" + args.name, {
    responseType: "text",
    headers: {
      authorization: args.token,
    },
    signal: args.signal,
  });
}
