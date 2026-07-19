import axios from "axios";

type getListArgs = {
  authToken: string;
  instanceUrl: string;
  signal: AbortSignal | undefined;
};

export async function getList(args: getListArgs): Promise<ListItem[]> {
  const result = await axios.get<ListItemRaw[]>(args.instanceUrl + "/list", {
    responseType: "json",
    headers: {
      authorization: args.authToken,
    },
    signal: args.signal,
  });

  return result.data.map((x) => ({
    url: args.instanceUrl + "/" + x.file_name,
    fileName: x.file_name,
    fileSize: x.file_size,
    expiresAtUtc: x.expires_at_utc ? new Date(x.expires_at_utc) : null,
  }));
}

type ListItemRaw = {
  file_name: string;
  file_size: number;
  expires_at_utc: string | null;
};

export type ListItem = {
  url: string;
  fileName: string;
  fileSize: number;
  expiresAtUtc: Date | null;
};
