require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const SessionDataSource = require('./datasources/sessions');
const SpeakerDataSource = require('./datasources/speakers');
const UserDataSource = require('./datasources/users');
const { expressMiddleware } = require('@apollo/server/express4');
const {
	ApolloServerPluginDrainHttpServer
} = require('@apollo/server/plugin/drainHttpServer');
const { startStandaloneServer } = require('@apollo/server/standalone');
const gql = require('graphql-tag');
const { readFileSync } = require('fs');
const typeDefs = gql(readFileSync('./schema.graphql', { encoding: 'utf-8' }));
const resolvers = require('./resolvers/index');
const http = require('http');
const auth = require('./utils/auth');
const cors = require('cors');
const { json } = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const { getCookie } = require('./helpers.js');

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

server.start().then((resolve) => {
	app.use(
		'/graphql',
		cors({
			origin: [
				'https://globomantics-apollo.up.railway.app/',
				'https://studio.apollographql.com'
			],
			credentials: true
		}),
		json(),
		expressMiddleware(server, {
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
			}
		})
	);

	httpServer.listen({ port: process.env.PORT || 4000 }, resolve);
	console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
