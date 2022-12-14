import {
	Field,
	Form,
	Formik,
	FormikProps,
	useFormik,
	ErrorMessage
} from 'formik';
import * as Yup from 'yup';
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

	const onSubmit = (values, actions) => {
		actions.setSubmitting(false);
		actions.resetForm({
			values: formik.initialValues
		});
		signin({ variables: { credentials: values } });
	};

	const formik = {
		initialValues: {
			email: '',
			password: ''
		},
		validationSchema: Yup.object({
			email: Yup.string().email('Invalid email address').required('Required'),
			password: Yup.string().min(6, 'Too short').required('Required')
		}),
		onSubmit,
		validateOnChange: true
	};

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
					validationSchema={formik.validationSchema}
					onSubmit={formik.onSubmit}
					validateOnChange={formik.validateOnChange}
				>
					{(formik) => (
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
										onBlur={formik.handleBlur}
										value={formik.values.email}
										required
									/>
									<ErrorMessage name="email" />
								</div>
								<div className={styles.input}>
									<label htmlFor="password">Password</label>
									<Field
										name="password"
										id="password"
										type="password"
										className="form-control"
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.password}
										required
									/>
									<ErrorMessage name="password" />
								</div>
								{submitError && (
									<p className={styles['submit-error']}>{submitError}</p>
								)}
								<button type="submit" className={styles.button}>
									Sign In
								</button>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default SignIn;
