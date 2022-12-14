const authUtils = require('../utils/auth');
const { GraphQLError } = require('graphql');

module.exports = {
	createSession: async (parent, args, { dataSources }, info) => {
		const speaker = await dataSources.speakerDataSource.getSpeakerById(
			args.session.speaker
		);

		const session = await dataSources.sessionDataSource.createSession({
			...args.session,
			speakers: [
				{
					id: speaker.id,
					name: speaker.name
				}
			]
		});
		return session;
	},
	signUp: async (parent, { credentials }, context, info) => {
		const { dataSources, res } = context;

		const { email, password } = credentials;
		const userCredentials = { email: email.toLowerCase(), password };

		const existingUser = dataSources.userDataSource.getUserByEmail(
			userCredentials.email
		);

		if (existingUser) {
			throw new GraphQLError('A user account with that email already exists.');
		}

		const hash = authUtils.hashPassword(userCredentials.password);

		const dbUser = dataSources.userDataSource.createUser({
			email: userCredentials.email,
			hash
		});

		const token = authUtils.createToken(dbUser);

		res.cookie(process.env.TOKEN, token, {
			httpOnly: true
		});

		return {
			user: {
				id: dbUser.id,
				email: dbUser.email
			}
		};
	},

	signIn: async (parent, { credentials }, { dataSources, res }, info) => {
		const { email, password } = credentials;
		const userCredentials = { email: email.toLowerCase(), password };

		const existingUser = dataSources.userDataSource.getUserByEmail(
			userCredentials.email
		);

		if (!existingUser) {
			throw new GraphQLError('Incorrect email address or password.');
		}

		const isValidPassword = authUtils.verifyPassword(
			password,
			existingUser.hash
		);

		if (!isValidPassword) {
			throw new GraphQLError('Incorrect email address or password.');
		}

		const token = authUtils.createToken(existingUser);

		res.cookie(process.env.TOKEN, token, {
			httpOnly: true
		});

		return {
			user: {
				id: existingUser.id,
				email: existingUser.email
			}
		};
	},
	userInfo: async (parent, args, { dataSources, userToken }, info) => {
		if (userToken) {
			const existingUser = authUtils.verifyToken(userToken);

			return {
				user: { id: existingUser.sub, email: existingUser.email }
			};
		}

		return {
			user: undefined
		};
	},
	signOut: async (parent, args, { dataSources, res }, info) => {
		res.clearCookie(process.env.TOKEN);
		return {
			user: undefined
		};
	},
	toggleFavoriteSession: async (parent, args, context, info) => {
		const { dataSources, userToken } = context;
		const user = authUtils.verifyToken(userToken);

		if (user) {
			const user =
				await context.dataSources.userDataSource.toggleFavoriteSession(
					args.sessionId,
					user.sub
				);
			return user;
		}
		return undefined;
	},
	markFeatured: async (parent, args, { dataSources }, info) => {
		return dataSources.speakerDataSource.markFeatured(
			args.speakerId,
			args.featured
		);
	}
};
