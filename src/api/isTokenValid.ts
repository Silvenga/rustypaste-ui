import axios from "axios";

type IsTokenValidArgs = {
  token: string;
  instanceUrl: string;
  signal?: AbortSignal;
};

export async function isTokenValid(args: IsTokenValidArgs): Promise<boolean> {
  try {
    await axios.get(args.instanceUrl + "/list", {
      responseType: "json",
      timeout: 5_000,
      headers: {
        authorization: args.token,
      },
      signal: args.signal,
    });
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return false;
    }
    throw error;
  }
}
