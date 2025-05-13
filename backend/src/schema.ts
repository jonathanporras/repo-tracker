import { gql } from "apollo-server";

export const typeDefs = gql`
  type Repo {
    id: Int!
    owner: String!
    name: String!
    latestReleaseTag: String
    releaseDate: String
    description: String
    hasBeenSeen: Boolean
    createdAt: String!
  }

  type Query {
    repos: [Repo!]!
  }

  type Mutation {
    createRepo(owner: String!, name: String!): Repo!
    deleteRepo(repoId: Int!): Repo!
    updateRepo(repoId: Int!, hasBeenSeen: Boolean!): Repo!
    refreshRepos: Boolean!
  }
`;
