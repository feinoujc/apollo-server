import gql from 'graphql-tag';
import { HttpLink } from 'apollo-link-http';

import { ApolloServer } from '../../';
import { startTestServer, toPromise } from '../';

const typeDefs = gql`
  type Query {
    hello(world: String): String
  }
`;

const resolvers = {
  Query: {
    hello: (_, { world }) => `Hello, ${world}`,
  },
};

describe('apollo-server-express > startTestServer', () => {
  it('executes an operation against a test server', async done => {
    const server = new ApolloServer({ typeDefs, resolvers });
    startTestServer(server);
    const { stop, graphql } = await startTestServer(server);

    const helloWorld = gql`
      query helloWorld($world: String!) {
        hello(world: $world)
      }
    `;

    const observable = await graphql({
      query: helloWorld,
      variables: { world: 'Apollo' },
    });

    const result = await toPromise(observable);

    expect(result).toEqual({ data: { hello: 'Hello, Apollo' } });
    stop();
  });
});
