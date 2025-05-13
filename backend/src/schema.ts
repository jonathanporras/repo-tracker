import { gql } from "apollo-server";

export const typeDefs = gql`
  type Repo {
    id: Int!
    owner: String!
    name: String!
    latestReleaseTag: String
    createdAt: String!
  }

  type Query {
    repos: [Repo!]!
  }

  type Mutation {
    createRepo(owner: String!, name: String!): Repo!
  }
`;
