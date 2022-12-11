import React, { useState } from 'react';
import './style-sessions.css';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Link, useHistory } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import AuthorCombobox from './AuthorCombobox';
import { SPEAKERS } from './Speakers';

const SESSIONS_ATTRIBUTES = gql`
	fragment SessionInfo on Session {
		id
		title
		startsAt
		day
		room
		level
		description @include(if: $isDescription)
		speakers {
			id
			name
		}
	}
`;

const CREATE_SESSION = gql`
	mutation createSession($session: SessionInput!, $isDescription: Boolean!) {
		createSession(session: $session) {
			...SessionInfo
		}
	}
	${SESSIONS_ATTRIBUTES}
`;

// Define the query
const SESSIONS = gql`
	query sessions($day: String!, $isDescription: Boolean!) {
		intro: sessions(day: $day, level: "Introductory and overview") {
			...SessionInfo
		}
		intermediate: sessions(day: $day, level: "Intermediate") {
			...SessionInfo
		}
		advanced: sessions(day: $day, level: "Advanced") {
			...SessionInfo
		}
	}
	${SESSIONS_ATTRIBUTES}
`;

const ALL_SESSIONS = gql`
	query sessions($isDescription: Boolean!) {
		sessions {
			...SessionInfo
		}
	}
	${SESSIONS_ATTRIBUTES}
`;

function AllSessionList() {
	const { loading, error, data } = useQuery(ALL_SESSIONS);

	if (loading) return <p>Loading Sessions..</p>;

	if (error) return <p>Error loading sessions!</p>;

	return data.sessions.map((session) => (
		<SessionItem key={session.id} session={session} />
	));
}

function SessionList({ day }) {
	// execute query and store response json
	let isDescription = true;

	const { loading, error, data } = useQuery(SESSIONS, {
		variables: { day, isDescription }
	});

	if (loading) return <p>Loading Sessions..</p>;

	if (error) return <p>Error loading sessions!</p>;

	const results = [];

	results.push(
		data.intro.map((session) => (
			<SessionItem key={session.id} session={session} />
		))
	);

	results.push(
		data.intermediate.map((session) => (
			<SessionItem key={session.id} session={session} />
		))
	);

	results.push(
		data.advanced.map((session) => (
			<SessionItem key={session.id} session={session} />
		))
	);

	return results;
}

function SessionItem({ session }) {
	const { id, title, day, room, level, startsAt, speakers, description } =
		session;
	return (
		<div key={id} className="session-item" style={{ padding: 5 }}>
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">{title}</h3>
					<h5>{`Level: ${level}`}</h5>
				</div>
				<div className="panel-body">
					<h5>{`Day: ${day}`}</h5>
					<h5>{`Room Number: ${room}`}</h5>
					<h5>{`Starts at: ${startsAt}`}</h5>
					<h5>{`Description: ${description?.substring(0, 100)}...`}</h5>
				</div>
				<div className="panel-footer">
					{speakers.map(({ id, name }) => (
						<span key={id} style={{ padding: 2 }}>
							<Link
								className="btn btn-default btn-lg"
								to={`/conference/speaker/${id}`}
							>
								View {name}'s Profile
							</Link>
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

export function Sessions() {
	const [day, setDay] = useState('Wednesday');
	return (
		<>
			<section className="banner">
				<div className="container">
					<div className="row" style={{ padding: 10 }}>
						<Link
							className="btn btn-lg center-block"
							to={`/conference/sessions/new`}
						>
							Submit a Session!
						</Link>
					</div>
					<div className="row">
						<button
							type="button"
							onClick={() => setDay('All')}
							className="btn-oval"
						>
							All Sessions
						</button>
						<button
							type="button"
							onClick={() => setDay('Wednesday')}
							className="btn-oval"
						>
							Wednesday
						</button>
						<button
							type="button"
							onClick={() => setDay('Thursday')}
							className="btn-oval"
						>
							Thursday
						</button>
						<button
							type="button"
							onClick={() => setDay('Friday')}
							className="btn-oval"
						>
							Friday
						</button>
					</div>
					<div className="session-grid">
						<SessionList day={day} />
					</div>
					{day == 'All' && <AllSessionList />}
				</div>
			</section>
		</>
	);
}

export function SessionForm() {
	const history = useHistory();
	const rooms = [
		'Jupiter',
		'Earth',
		'Venus',
		'Mars',
		'Mercury',
		'Saturn',
		'Sol'
	];
	const { data: speakersData, loading } = useQuery(SPEAKERS);
	const [speakers, setSpeakers] = useState([]);
	const [speaker, setSpeaker] = useState('');
	console.log(speakersData);
	const updateSessions = (cache, { data }) => {
		cache.modify({
			fields: {
				sessions(exisitingSessions = []) {
					const newSession = data.createSession;
					cache.writeQuery({
						query: ALL_SESSIONS,
						data: { newSession, ...exisitingSessions }
					});
				}
			}
		});
	};

	const addSession = async (formikValues) => {
		const getRandomValue = (lng) => {
			return Math.floor(Math.random() * lng);
		};
		const extraValue = {
			startsAt: getRandomValue(13) + ':00',
			room: rooms[getRandomValue(rooms.length)],
			speaker
		};

		const values = { ...formikValues, ...extraValue };
		await create({ variables: { session: values, isDescription: true } });
	};

	const [create, { called, error, data }] = useMutation(CREATE_SESSION, {
		update: updateSessions,
		onCompleted: () => history.push('/conference/sessions')
	});

	if (loading) return <p>Loading...</p>;

	if (called) return <p>Session Submitted Successfully!</p>;

	if (error) return <p>Failed to submit session</p>;

	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				alignContent: 'center',
				justifyContent: 'center',
				padding: 10
			}}
		>
			<Formik
				initialValues={{
					title: '',
					description: '',
					day: '',
					level: ''
				}}
				onSubmit={(values) => {
					// await create({ variables: { session: values, isDescription: true } });
					addSession(values);
				}}
			>
				{() => (
					<Form style={{ width: '100%', maxWidth: 500 }}>
						<h3 className="h3 mb-3 font-weight-normal">Submit a Session!</h3>
						<div className="mb-3" style={{ paddingBottom: 5 }}>
							<label htmlFor="inputTitle">Title</label>
							<Field
								id="inputTitle"
								className="form-control"
								required
								autoFocus
								name="title"
							/>
						</div>
						<div className="mb-3" style={{ paddingBottom: 5 }}>
							<label htmlFor="inputDescription">Description</label>
							<Field
								type="textarea"
								id="inputDescription"
								className="form-control"
								required
								name="description"
							/>
						</div>
						<div className="mb-3" style={{ paddingBottom: 5 }}>
							<label htmlFor="inputDay">Day</label>
							<Field
								name="day"
								id="inputDay"
								className="form-control"
								required
							/>
						</div>
						<div className="mb-3" style={{ paddingBottom: 5 }}>
							<label htmlFor="inputLevel">Level</label>
							<Field
								name="level"
								id="inputLevel"
								className="form-control"
								required
							/>
						</div>
						{/* <div className="mb-3" style={{ paddingBottom: 5 }}>
							<label htmlFor="speaker">Speaker</label>
							<Field name="speaker" className="form-control">
							</Field>
						</div> */}
						<AuthorCombobox
							data={speakersData}
							speakers={speakers}
							setSpeakers={setSpeakers}
							setSpeaker={setSpeaker}
						/>

						<div style={{ justifyContent: 'center', alignContent: 'center' }}>
							<button className="btn btn-primary">Submit</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}

export function AddSession() {
	return (
		<>
			<section className="banner">
				<div className="container">
					<div className="row">
						<SessionForm />
					</div>
				</div>
			</section>
		</>
	);
}
