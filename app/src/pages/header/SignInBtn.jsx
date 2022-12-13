import React from 'react';
import { Link } from 'react-router-dom';

const SignInBtn = () => {
	return (
		<div className="text-center">
			<Link to="/signin">
				<button type="button" className="btn btn-primary btn-sm">
					SIGN IN
				</button>
			</Link>
		</div>
	);
};

export default SignInBtn;
