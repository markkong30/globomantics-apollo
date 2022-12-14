import React, { useEffect } from 'react';
import { Home } from './pages/home/Home';
import { Media } from './pages/media/Media';
import { OurStory } from './pages/our-story/OurStory';
import { Robotics } from './pages/robotics/Robotics';
import { Conference } from './pages/conference/Conference';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { Header } from './pages/header/Header';
import { Footer } from './Footer';
import {
	ApolloClient,
	ApolloProvider,
	createHttpLink,
	InMemoryCache
} from '@apollo/client';
import SignUp from './pages/sign/SignUp';
import { UserInfo } from './context/userContext';
import SignIn from './pages/sign/SignIn';

// Initialize Apollo Client
const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: createHttpLink({
		uri: 'https://globomantics-apollo-production-dc23.up.railway.app/',
		uri: '/graphql',
		credentials: 'include'
	})
});

function AppRouter() {
	return (
		<div id="wrapper">
			<UserInfo>
				<Router>
					<Header />
					<Switch>
						<Route path="/media">
							<Media />
						</Route>
						<Route path="/our-story">
							<OurStory />
						</Route>
						<Route path="/robotics">
							<Robotics />
						</Route>
						<Route path="/conference">
							<Conference />
						</Route>
						<Route path="/signup">
							<SignUp />
						</Route>
						<Route path="/signin">
							<SignIn />
						</Route>
						<Route path="/">
							<Home />
						</Route>
					</Switch>
					<Footer />
				</Router>
			</UserInfo>
		</div>
	);
}

function App() {
	return (
		<ApolloProvider client={client}>
			<AppRouter />
		</ApolloProvider>
	);
}

export default App;
