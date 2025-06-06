import { getLatestRelease, getRepoDetails } from "./githubService";
import { refreshRepos } from "./refreshRepos";

export const resolvers = {
  Query: {
    repos: async (_: any, __: any, { prisma }: any) => {
      return prisma.repo.findMany({
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    },
  },
  Mutation: {
    createRepo: async (_: any, args: any, { prisma }: any) => {
      const repoData = await getRepoDetails(args.owner, args.name);
      const releaseData = await getLatestRelease(args.owner, args.name);
      if (releaseData && repoData) {
        return prisma.repo.create({
          data: {
            owner: args.owner,
            name: args.name,
            description: repoData.description,
            latestReleaseTag: releaseData.tagName,
            releaseDate: releaseData.publishedAt,
          },
        });
      }
    },
    deleteRepo: async (_: any, args: any, { prisma }: any) => {
      return prisma.repo.delete({
        where: {
          id: args.repoId,
        },
      });
    },
    updateRepo: async (_: any, args: any, { prisma }: any) => {
      return prisma.repo.update({
        where: {
          id: args.repoId,
        },
        data: {
          hasBeenSeen: args.hasBeenSeen,
        },
      });
    },
    refreshRepos: async (_: any, args: any, { prisma }: any) => {
      return await refreshRepos();
    },
  },
};
