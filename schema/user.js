export default `
type Channel {
  id: Int!
  name:String!
  public: Boolean!
  message: [Message!]!
  users: [User!]!
}

type Team {
  owner: User!
  members: [User!]!
  channels: [Channel!]!
}


type Message {
  id: Int!
  text: String!
  user:User!
  channel: Channel!

}
  
type User {
    id: Int!
    username:String!
    email:String!
    teams: [Team!]!
  }

  type Query {
    hi: String
  }
`;
