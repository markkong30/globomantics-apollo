import {
	Field,
	Form,
	Formik,
	FormikProps,
	useFormik,
	ErrorMessage
} from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import styles from './signIn.module.scss';
import { SIGN_IN } from './mutation.helper';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

const SignIn = () => {
	const { user, getUserInfo } = useContext(UserContext);
	const history = useHistory();
	const [values, setValues] = useState({});
	const [submitError, setSubmitError] = useState('');
	const [signin, { data }] = useMutation(SIGN_IN, {
		onCompleted: () => {
			getUserInfo().then(() => history.goBack());
		},
		onError: (err) => setSubmitError(err?.graphQLErrors[0]?.message)
	});

	useEffect(() => {
		if (user && !data) {
			setTimeout(() => {
				history.goBack();
			}, 3000);
		}
	}, [user]);

	const handleChange = (e) => {
		setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const onSubmit = (values) => {
		signin({ variables: { credentials: values } });
	};
	const validate = (values) => {
		const errors = {};

		if (!values.email) {
			errors.email = 'Required';
		} else if (
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
		) {
			errors.email = 'Invalid email address';
		}

		if (!values.password) {
			errors.password = 'Required';
		} else if (values.password.length < 5) {
			errors.password = 'Too short';
		}

		return errors;
	};

	const formik = useFormik({
		initialValues: {
			email: '',
			password: ''
		},
		validate,
		onSubmit,
		validateOnChange: false
	});

	if (user) {
		return (
			<div className={styles['signed-in']}>
				<p>Already signed in, </p>
				<p>Redirecting...</p>
			</div>
		);
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<h1 className={styles.heading}>Sign In</h1>
				<Formik
					initialValues={formik.initialValues}
					onSubmit={formik.handleSubmit}
					validateOnChange={formik.validateOnChange}
				>
					<Form>
						<div className={styles.form}>
							<div className={styles.input}>
								<label htmlFor="email">Email</label>
								<Field
									name="email"
									id="email"
									type="email"
									className="form-control"
									onChange={formik.handleChange}
									value={formik.values.email}
									required
								/>
								<ErrorMessage name="name" />
							</div>
							<div className={styles.input}>
								<label htmlFor="password">Password</label>
								<Field
									name="password"
									id="password"
									type="password"
									className="form-control"
									onChange={formik.handleChange}
									value={formik.values.passowrd}
									required
								/>
								<ErrorMessage name="email" />
							</div>
							{submitError && (
								<p className={styles['submit-error']}>{submitError}</p>
							)}
							<button type="submit" className={styles.button}>
								Sign In
							</button>
						</div>
					</Form>
				</Formik>
			</div>
		</div>
	);
};

export default SignIn;
