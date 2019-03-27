import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import path from "path";

import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import cors from "cors";
import { refreshTokens } from "./auth";

import models from "./models";

const SECRET = "SuperSecret";

const SECRET2 = "SuperSecret2";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));

const resolvers = mergeResolvers(
	fileLoader(path.join(__dirname, "./resolvers"))
);

const app = express();

app.use(cors("*"));

const addUser = async (req, res, next) => {
	const token = req.headers["x-token"];

	if (token) {
		try {
			const { user } = jwt.verify(token, SECRET);
		} catch (err) {
			const refreshToken = req.headers["x-refresh-token"];
			const newToken = await refreshToken(token, refreshToken, models, SECRET);

			if (newTokens.token && newTokens.refreshToken) {
				res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
				res.set("x-token", newTokens.token);
				res.set("x-refresh-token", newTokens.refreshToken);
			}

			req.user = newTokens.user;
		}
	}
	next();
};

app.use(addUser);

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});
const graphqlEndpoint = "/graphql";

app.use(
	graphqlEndpoint,
	bodyParser.json(),
	graphqlExpress((req) => ({
		schema,
		context: {
			models,
			user: req.user,
			SECRET,
			SECRET2
		}
	}))
);

app.use("/graphiql", graphiqlExpress({ endpointURL: graphqlEndpoint }));

models.sequelize.sync({}).then((x) => {
	app.listen(8000);
});
