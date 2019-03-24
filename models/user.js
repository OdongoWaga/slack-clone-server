export default (sequelize, DataTypes) => {
	const User = sequelize.define("user", {
		username: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isAlphanumeric: {
					args: true,
					msg: "The username can only contain letters and numbers"
				},
				len: {
					args: [3, 25],
					msg: "Username needs to be between 3 and 25 characters"
				}
			}
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				args: true,
				msg: "Invalid Email"
			}
		},
		password: {
			type: DataTypes.STRING,
			validate: {
				len: {
					args: [5, 25],
					msg: "Password needs to be between 5 and 25 characters"
				}
			}
		}
	});

	User.associate = (models) => {
		User.belongsToMany(models.Team, {
			through: "member",
			foreignKey: {
				name: "userId",
				field: "user_id"
			}
		});
		// N:M
		User.belongsToMany(models.Channel, {
			through: "channel_member",
			foreignKey: {
				name: "userId",
				field: "user_id"
			}
		});
	};

	return User;
};
