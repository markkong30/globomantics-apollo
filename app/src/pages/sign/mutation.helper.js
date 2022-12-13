import { gql } from '@apollo/client';

export const SIGN_UP = gql`
	mutation SignUp($credentials: Credentials!) {
		signUp(credentials: $credentials) {
			user {
				id
				email
			}
		}
	}
`;

export const SIGN_IN = gql`
	mutation SignIn($credentials: Credentials!) {
		signIn(credentials: $credentials) {
			user {
				id
				email
			}
		}
	}
`;
