import { GraphqlQueryBuilder } from '@/components/tools/graphql-query-builder';

export const metadata = {
  title: 'GraphQL Query Builder | Build Queries Visually',
  description: 'Build GraphQL queries visually with our free online tool. Support for fields, arguments, nested queries, variables, and mutations. Generate formatted GraphQL instantly.',
  keywords: ['graphql query builder', 'graphql generator', 'graphql tool', 'build graphql query', 'graphql mutation builder', 'graphql visual builder', 'graphql online'],
  openGraph: {
    title: 'GraphQL Query Builder | Build Queries Visually',
    description: 'Build GraphQL queries visually with our free online tool. Support for fields, arguments, nested queries, variables, and mutations. Generate formatted GraphQL instantly.',
    type: 'website',
    url: '/tools/graphql-query-builder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GraphQL Query Builder | Build Queries Visually',
    description: 'Build GraphQL queries visually with our free online tool. Support for fields, arguments, nested queries, variables, and mutations. Generate formatted GraphQL instantly.',
  },
};

export default function GraphqlQueryBuilderPage() {
  return <GraphqlQueryBuilder />;
}
