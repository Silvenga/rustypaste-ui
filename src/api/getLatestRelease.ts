import axios from "axios";

const REPO = "Silvenga/rustypaste-ui";
const CHECK_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
const FALLBACK_RELEASE_URL = `https://github.com/${REPO}/releases/latest`;

export type LatestRelease = {
  /** Release tag with leading `v` stripped, e.g. "1.2.0". */
  version: string;
  /** HTML page of the release on GitHub. */
  releaseUrl: string;
};

type GitHubReleaseResponse = {
  tag_name: string;
  html_url: string | null;
  prerelease: boolean;
  draft: boolean;
};

export async function getLatestRelease(signal?: AbortSignal): Promise<LatestRelease> {
  const result = await axios.get<GitHubReleaseResponse>(CHECK_URL, {
    responseType: "json",
    signal,
    headers: { Accept: "application/vnd.github+json" },
    validateStatus: (status) => status >= 200 && status < 300,
  });

  const version = result.data.tag_name.replace(/^v/, "");
  if (!version) {
    throw new Error(`Unexpected tag_name from GitHub: ${result.data.tag_name}`);
  }

  return {
    version,
    releaseUrl: result.data.html_url || FALLBACK_RELEASE_URL,
  };
}
