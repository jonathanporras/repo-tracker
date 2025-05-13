import { octokit } from "./githubClient";

export async function getRepoDetails(owner: string, repo: string) {
  const { data } = await octokit.repos.get({ owner, repo });
  return {
    name: data.name,
    description: data.description,
    url: data.html_url,
  };
}

export async function getLatestRelease(owner: string, repo: string) {
  try {
    const { data } = await octokit.repos.getLatestRelease({ owner, repo });
    return {
      tagName: data.tag_name,
      publishedAt: data.published_at,
      url: data.html_url,
    };
  } catch (err: any) {
    throw err;
  }
}
