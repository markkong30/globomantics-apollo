import React, { useContext, useEffect, useRef, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import avatar from './user.svg';
import styles from './userProfile.module.scss';
import { UserContext } from '../../context/userContext';
import { useHistory } from 'react-router-dom';

const SIGN_OUT = gql`
	mutation SignOut {
		signOut {
			user {
				email
				id
			}
		}
	}
`;

const UserProfile = ({ user }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { getUserInfo } = useContext(UserContext);
	const history = useHistory();
	const buttonRef = useRef(null);
	const [signout, { data }] = useMutation(SIGN_OUT, {
		onCompleted: () => {
			getUserInfo().then(() => history.push('/'));
		}
	});

	useEffect(() => {
		if (isOpen && buttonRef) {
			buttonRef.current.focus();
		}
	}, [isOpen]);

	const handleSignOut = (e) => {
		e.preventDefault();
		e.stopPropagation();

		signout();
	};

	const handleDropDown = () => {
		setIsOpen((prev) => !prev);
	};
	return (
		<div className={styles.container} onClick={handleDropDown}>
			<img className={styles.avatar} src={avatar} alt="" />
			<p className={styles.email}>{user?.email}</p>
			{isOpen && (
				<button
					className={styles['sign-out']}
					ref={buttonRef}
					onClick={handleSignOut}
					onBlur={() => setIsOpen(false)}
				>
					<p className={styles.text}>Sign Out</p>
				</button>
			)}
		</div>
	);
};

export default UserProfile;
