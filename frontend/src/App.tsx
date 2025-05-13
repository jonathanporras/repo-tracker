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
      description
      releaseDate
      hasBeenSeen
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

const UPDATE_REPO = gql`
  mutation ($repoId: Int!, $hasBeenSeen: Boolean!) {
    updateRepo(repoId: $repoId, hasBeenSeen: $hasBeenSeen) {
      id
    }
  }
`;

const DELETE_REPO = gql`
  mutation ($repoId: Int!) {
    deleteRepo(repoId: $repoId) {
      id
    }
  }
`;

const REFRESH_REPOS = gql`
  mutation {
    refreshRepos
  }
`;

function Repos() {
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const { data, loading, refetch } = useQuery(GET_REPOS);
  const [createRepo] = useMutation(CREATE_REPO);
  const [deleteRepo] = useMutation(DELETE_REPO);
  const [updateRepo] = useMutation(UPDATE_REPO);
  const [refreshRepos] = useMutation(REFRESH_REPOS);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="repo-tracker">
      <div className="form-section">
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
        <button
          className="submit-button"
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
        <button
          onClick={async () => {
            await refreshRepos();
            refetch();
          }}
        >
          Refresh All Repos
        </button>
      </div>
      <div className="repo-list-wrapper">
        <ul className="repo-list">
          {data?.repos?.map((repo: any) => (
            <li className="repo-card" key={repo.id} onClick={() => setSelectedRepoId(repo.id)}>
              <button
                className="delete-button"
                onClick={() => {
                  deleteRepo({ variables: { repoId: repo.id } });
                  refetch();
                }}
              >
                Delete
              </button>
              {!repo.hasBeenSeen && (
                <div>
                  <button
                    className="seen-button"
                    onClick={() => {
                      updateRepo({ variables: { repoId: repo.id, hasBeenSeen: true } });
                      refetch();
                    }}
                  >
                    Mark as Seen
                  </button>
                </div>
              )}
              <p>
                Name: {repo.owner}/{repo.name}
              </p>
              <p>Latest Release: {repo?.latestReleaseTag}</p>
              <p>Release Date: {repo?.releaseDate}</p>
            </li>
          ))}
        </ul>
        <div className="repo-description">
          <p>Description:</p>
          {selectedRepoId && (
            <p>{data.repos.find((repo: any) => repo.id === selectedRepoId).description}</p>
          )}
        </div>
      </div>
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
