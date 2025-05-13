import { PrismaClient } from "../generated/prisma";
import { getLatestRelease } from "./githubService";

const prisma = new PrismaClient();

export async function refreshRepos() {
  let updates = false;
  const repos = await prisma.repo.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  for (const repo of repos) {
    const latestReleaseData = await getLatestRelease(repo.owner, repo.name);

    // Update release tag if it's been changed
    if (repo.latestReleaseTag !== latestReleaseData.tagName) {
      await prisma.repo.update({
        where: {
          id: repo.id,
        },
        data: {
          hasBeenSeen: false,
          latestReleaseTag: latestReleaseData.tagName,
          releaseDate: latestReleaseData.publishedAt,
        },
      });
      updates = true;
    } else {
      if (repo.hasBeenSeen === true) {
        await prisma.repo.update({
          where: {
            id: repo.id,
          },
          data: {
            hasBeenSeen: false,
          },
        });
        updates = true;
      }
    }
  }
  return updates;
}
