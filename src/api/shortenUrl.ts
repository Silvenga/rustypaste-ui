import axios from "axios";

type ShortenUrlArgs = {
  url: string;
  token: string;
  instanceUrl: string;
  signal?: AbortSignal;
};

export async function shortenUrl(args: ShortenUrlArgs) {
  const form = new FormData();
  form.append("url", args.url);
  const result = await axios.postForm(args.instanceUrl, form, {
    responseType: "text",
    headers: {
      authorization: args.token,
    },
    signal: args.signal,
  });

  if (!(typeof result.data === "string")) {
    throw new Error("Unexpected response from server");
  }
  return result.data.trim();
}
