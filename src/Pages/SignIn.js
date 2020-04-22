import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from './SignUp';
import { withFirebase } from '../Components/Firebase';
import * as ROUTES from '../Routes';
import { PasswordForgetLink } from '../Components/PasswordForget';
import iconUser from '../Assets/images/icon/account/user.png';
import iconPassword from '../Assets/images/icon/account/password.png';

const INITIAL_STATE = {
	email: '',
	password: '',
	error: null,
};

class SignIn extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	componentDidMount = () => {
		document.body.removeAttribute('class');
        document.body.classList.add('background-signin');
	}
	
	onSubmit = event => {
		const { email, password } = this.state;
		this.props.firebase
			.doSignInWithEmailAndPassword(email, password)
			.then(() => {
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				this.setState({ error: "L'utilisateur ou le mot de passe est invalide" });
			});
		event.preventDefault();
	};
	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, password, error } = this.state;
		const isInvalid = password === '' || email === '';
		return (
			<div className="header-container-padding">
				<div class="overlay overlay-background"></div>
				<div className="container container-margin">
					<h1 className="text-center primary-color margin-signin">Connexion</h1>
					<form onSubmit={this.onSubmit}>
						<div className="row no-gutters d-flex justify-content-center">
							<div className="col-8 col-md-6 col-lg-4 position-relative">
								<input
									name="email"
									value={email}
									onChange={this.onChange}
									type="text"
									placeholder="Email Address"
									className="mb-4 w-100 pl-5 input-signin"
								/>
								<img src={iconUser} className="input-signin-icon" />
							</div>
						</div>

						<div className="row no-gutters d-flex justify-content-center margin-signin">
							<div className="col-8 col-md-6 col-lg-4 position-relative">
								<input
									name="password"
									value={password}
									onChange={this.onChange}
									type="password"
									placeholder="Password"
									className="w-100 pl-5 input-signin"
								/>
								<img src={iconPassword} className="input-signin-icon" />
							</div>
						</div>
						<div className="row no-gutters d-flex justify-content-center">
							<div className="col-8 col-md-6 col-lg-4 text-center">
								<button disabled={isInvalid} type="submit" className="btn btn-primary py-3 px-4 mb-5">
									Se connecter
								</button>
								{error && <p className="white-color mb-5">{this.state.error}</p>}
							</div>
						</div>
					</form>
					<div className="row no-gutters d-flex justify-content-center">
						<div className="col-12 col-md-8 text-center">
							<PasswordForgetLink />
							<SignUpLink />
						</div>
					</div>
				</div>
			</div>	
		);
	}
}

const SignInPage = compose(
	withRouter,
	withFirebase,
)(SignIn);
export default SignInPage;