const { buildSchema } = require('graphfront');

export const schema = buildSchema(`
  type Query {
    ping: String
  }

  type Project {
    id: String!
    urlToken: String!
    apiKey: String!
  }

  input UpdateProjectInput {
    projectId: String!
    updateApiKey: Boolean!
    updateUrlToken: Boolean!
  }

  type Mutation {
    updateProject(input: UpdateProjectInput!): Project
  }
`);
