import { getLatestRelease } from "./githubService";

export const resolvers = {
  Query: {
    repos: async (_: any, __: any, { prisma }: any) => {
      return prisma.repo.findMany();
    },
  },
  Mutation: {
    createRepo: async (_: any, args: any, { prisma }: any) => {
      const data = await getLatestRelease(args.owner, args.name);
      if (data) {
        return prisma.repo.create({
          data: {
            owner: args.owner,
            name: args.name,
            latestReleaseTag: data.tagName,
          },
        });
      }
    },
  },
};
