import { Field, Form, Formik, FormikProps, useFormik } from 'formik';
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import styles from './signUp.module.scss';
import { SIGN_UP } from './mutation.helper';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
	const history = useHistory();
	const [values, setValues] = useState({});
	const [signup, { data }] = useMutation(SIGN_UP, {
		onCompleted: () => history.push('/')
	});

	const handleChange = (e) => {
		setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const onSubmit = (values) => {
		signup({ variables: { credentials: values } });
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

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<h1 className={styles.heading}>Sign Up Today</h1>
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
								{formik.errors.email ? <div>{formik.errors.email}</div> : null}
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
								{formik.errors.password ? (
									<div>{formik.errors.password}</div>
								) : null}
							</div>
							<button type="submit" className={styles.button}>
								Sign Up
							</button>
						</div>
					</Form>
				</Formik>
			</div>
		</div>
	);
};

export default SignUp;
