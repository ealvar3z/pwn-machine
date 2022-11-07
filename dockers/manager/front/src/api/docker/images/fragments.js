import gql from "graphql-tag";

export const IMAGE_FRAGMENT = gql`
  fragment ImageFragment on DockerImage {
    id
    shortId
    name
    tags
    labels {
      key
      value
    }
    history {
      operation
      argument
    }
    parent
    created
    size
    entrypoint
    command
    environment {
      key
      value
    }
    usedBy(onlyRunning: false) {
      id
      name
    }
  }
`;
