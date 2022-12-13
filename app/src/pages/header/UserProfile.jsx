import React from 'react';
import avatar from './user.svg';
import styles from './userProfile.module.scss';

const UserProfile = ({ user }) => {
	console.log(user);
	return (
		<div className={styles.container}>
			<img className={styles.avatar} src={avatar} alt="" />
			<p className={styles.email}>{user?.email}</p>
		</div>
	);
};

export default UserProfile;
