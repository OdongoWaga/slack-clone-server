import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import path from "path";
const cors = require("cors");

import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";

import models from "./models";

const SECRET = "SuperSecret";
const SECRET2 = "SuperSecret2";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));

const resolvers = mergeResolvers(
	fileLoader(path.join(__dirname, "./resolvers"))
);

const app = express();

app.use(cors("*"));

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});
const graphqlEndpoint = "/graphql";

app.use(
	graphqlEndpoint,
	bodyParser.json(),
	graphqlExpress({
		schema,
		context: {
			models,
			user: {
				id: 1
			},
			SECRET,
			SECRET2
		}
	})
);

app.use("/graphiql", graphiqlExpress({ endpointURL: graphqlEndpoint }));

models.sequelize.sync({}).then((x) => {
	app.listen(8000);
});
