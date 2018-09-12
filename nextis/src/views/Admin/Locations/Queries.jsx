import gql from 'graphql-tag';

const locationsQuery = gql`
query FetchLocations {
  locations {
    id
    name
    addressLine1
    addressLine2
    city
    zipCode
    countryCode
  }
}
`;

const deleteLocationMutation = gql`
mutation DeleteLocation (
  $id: Int!
) {
  DeleteLocation(id: $id)
}
`;

export {
    locationsQuery,
    deleteLocationMutation,
}