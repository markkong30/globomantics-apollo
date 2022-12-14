require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const SessionDataSource = require('./datasources/sessions');
const SpeakerDataSource = require('./datasources/speakers');
const UserDataSource = require('./datasources/users');
const { startStandaloneServer } = require('@apollo/server/standalone');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers/index');
const auth = require('./utils/auth');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { getCookie } = require('./helpers.js');

async function startApolloServer(typeDefs, resolvers) {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [
			cookieParser(),
			cors({
				origin: 'http://localhost:3000',
				credentials: true
			})
		]
	});

	const { url } = await startStandaloneServer(server, {
		context: async ({ req, res }) => {
			const { cache } = server;
			const token = req.headers.token;
			const cookies = req.headers.cookie;

			return {
				token,
				res,
				cookies,
				dataSources: {
					sessionDataSource: new SessionDataSource(),
					speakerDataSource: new SpeakerDataSource(),
					userDataSource: new UserDataSource()
				}
			};
		},
		listen: { port: process.env.PORT || 4000 }
	});

	console.log(`🚀  Server is running at ${url}`);
}

startApolloServer(typeDefs, resolvers);
