import bcrypt from "bcrypt";
import _ from "lodash";

/*
pick picks out whats in the second argument
_.pick({a:1, b:2}, 'a')=> {a:1}

*/

//used to check the errors object and if it is a validation error or not and returns the message
const formatErrors = (e, models) => {
	if (e instanceof models.sequelize.ValidationError) {
		return e.errors.map((x) => __.pick(x, ["path", "message"]));
	}
	return [{ path: "name", message: "something went wrong" }];
};

export default {
	Query: {
		getUsers: (parent, { id }, { models }) =>
			models.User.findOne({ where: { id } }),
		allUsers: (parent, args, { models }) => models.User.findAll()
	},
	Mutation: {
		register: async (parent, { password, ...otherArgs }, { models }) => {
			try {
				const hashedPassword = await bcrypt.hash(password, 12);
				const user = await models.User.create({
					...otherArgs,
					password: hashedPassword
				});
				return {
					ok: true,
					user
				};
			} catch (err) {
				return {
					ok: false,
					errors: formatErrors(err, models);
				};
			}
		}
	}
};
