export default ` 
type User {
    id: Int!
    username:String!
    email:String!
    teams: [Team!]!
  }

  type Query{
    getUsers(id: Int!): User!
    allUsers: [User!]
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
  }

`;
