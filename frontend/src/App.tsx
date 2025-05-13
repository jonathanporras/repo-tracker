import { ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";
import client from "./apolloClient";
import { useState } from "react";

const GET_REPOS = gql`
  query {
    repos {
      id
      owner
      name
      latestReleaseTag
    }
  }
`;

const CREATE_REPO = gql`
  mutation ($owner: String!, $name: String!) {
    createRepo(owner: $owner, name: $name) {
      id
      owner
      name
    }
  }
`;

function Repos() {
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const { data, loading, refetch } = useQuery(GET_REPOS);
  const [createRepo] = useMutation(CREATE_REPO);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <p>
          github.com/
          <input
            placeholder="Owner"
            value={owner}
            onChange={(event) => setOwner(event?.target.value)}
          />
          /
          <input
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event?.target.value)}
          />
        </p>
      </div>
      <button
        onClick={async () => {
          try {
            await createRepo({ variables: { owner: owner, name: name } });
          } catch (e) {
            alert(e);
          }
          setName("");
          setOwner("");
          refetch();
        }}
      >
        Add Repo
      </button>
      <ul>
        {data?.repos?.map((repo: any) => (
          <li key={repo.id}>
            {repo.owner}/{repo.name}
            <p>Latest Release: {repo.latestReleaseTag}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Repos />
    </ApolloProvider>
  );
}
