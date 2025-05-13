import { getLatestRelease, getRepoDetails } from "./githubService";

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
  },
};
