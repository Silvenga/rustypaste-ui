import axios from "axios";

type GetVersionArgs = {
  authToken: string;
  instanceUrl: string;
  signal: AbortSignal | undefined;
}

export async function getVersion(args: GetVersionArgs) {
  const result = await axios.get(
    args.instanceUrl + "/version",
    {
      responseType: "text",
      headers: {
        "authorization": args.authToken,
      },
      signal: args.signal,
    },
  );

  if (!(typeof result.data === "string")) {
    throw new Error("Unexpected response from server");
  }
  return result.data.trim();
}
