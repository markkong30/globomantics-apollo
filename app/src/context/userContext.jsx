import React, { useEffect } from 'react';
import { createContext } from 'react';
import { useMutation, gql } from '@apollo/client';

const userInfoMutation = gql`
	mutation userInfo {
		userInfo {
			user {
				id
				email
			}
		}
	}
`;

export const UserContext = createContext();

export const UserInfo = ({ children }) => {
	const [getUserInfo, { data }] = useMutation(userInfoMutation);

	useEffect(() => {
		if (!data) {
			getUserInfo();
		}
	}, [data]);

	return (
		<UserContext.Provider value={{ user: data?.userInfo?.user, getUserInfo }}>
			{children}
		</UserContext.Provider>
	);
};
