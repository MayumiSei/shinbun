import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Components/Firebase';
import * as ROUTES from '../Routes';
import { compose } from 'recompose';
import iconUser from '../Assets/images/icon/account/user.png';
import iconMail from '../Assets/images/icon/account/mail.png';
import iconPassword from '../Assets/images/icon/account/password.png';

const INITIAL_STATE = {
	username: '',
	email: '',
	passwordOne: '',
	passwordTwo: '',
	error: null,
};

class SignUp extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	componentDidMount = () => {
		document.body.removeAttribute('class');
        document.body.classList.add('background-signin');
	}

	onSubmit = event => {
		const { username, email, passwordOne } = this.state;
		this.props.firebase
			.doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(authUser => {
				// Create a user in realtime database
				return this.props.firebase
					.user(authUser.user.uid)
					.set({
						username,
						email,
						role: 'MEMBER'
					});
			})
			.then(authUser => {
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				this.setState({ error });
			});
		event.preventDefault();
	}

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const {
			username,
			email,
			passwordOne,
			passwordTwo,
			error,
		} = this.state;

		const isInvalid =
			passwordOne !== passwordTwo ||
			passwordOne === '' ||
			email === '' ||
			username === '';

		return (
			<div className="header-container-padding">
				<div className="container container-margin">
					<h1 className="text-center primary-color margin-signin">Inscription</h1>
					<form onSubmit={this.onSubmit}>
						<div className="row no-gutters d-flex justify-content-center">
								<div className="col-8 col-md-6 col-lg-4 position-relative">
									<input name="username" value={username} onChange={this.onChange} type="text"
										placeholder="Nom d'utilisateur" className="mb-4 w-100 pl-5 input-signin" />
								<img src={iconUser} className="input-signin-icon" />
							</div>
						</div>
						<div className="row no-gutters d-flex justify-content-center">
								<div className="col-8 col-md-6 col-lg-4 position-relative">
								<input name="email" value={email} onChange={this.onChange} type="text"
									placeholder="Adresse email" className="mb-4 w-100 pl-5 input-signin" />
								<img src={iconMail} className="input-signin-icon" />
							</div>
						</div>
						<div className="row no-gutters d-flex justify-content-center">
								<div className="col-8 col-md-6 col-lg-4 position-relative">
								<input name="passwordOne" value={passwordOne} onChange={this.onChange} type="password"
								placeholder="Mot de passe" className="mb-4 w-100 pl-5 input-signin" />
								<img src={iconPassword} className="input-signin-icon" />
							</div>
						</div>
						<div className="row no-gutters d-flex justify-content-center">
								<div className="col-8 col-md-6 col-lg-4 position-relative">
								<input name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password"
								placeholder="Confirmer le mot de passe" className="mb-4 w-100 pl-5 input-signin" />
								<img src={iconPassword} className="input-signin-icon" />
							</div>
						</div>
						
						<div className="row no-gutters d-flex justify-content-center">
							<div className="col-8 col-md-6 col-lg-4 text-center">
								<button disabled={isInvalid} type="submit" className="btn btn-primary py-3 px-4 mb-5">
									S'inscrire
								</button>
								{error && <p className="white-color mb-5">{error.message}</p>}
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

const SignUpLink = () => (
	<p className="white-color">
		Vous n'avez pas de compte ? <Link to={'/signup'} className="primary-color">Inscrivez-vous</Link>
	</p>
);

const SignUpPage = compose(
	withRouter,
	withFirebase,
)(SignUp);

export default SignUpPage;
export { SignUpLink };