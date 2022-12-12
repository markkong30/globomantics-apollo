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
