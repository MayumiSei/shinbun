import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../Routes';
import iconUser from '../../Assets/images/icon/account/user.png'


const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForget extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount = () => {
		document.body.removeAttribute('class');
        document.body.classList.add('background-default');
	}

    onSubmit = event => {
        const { email } = this.state;
        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, error } = this.state;
        const isInvalid = email === '';

        return (
            <div className="header-container-padding">
                <div class="overlay overlay-background"></div>
                <div className="container container-margin">
                    <h1 className="text-center primary-color margin-signin">Mot de passe oublié</h1>
                    <form onSubmit={this.onSubmit}>
                        <div className="row no-gutters d-flex justify-content-center mb-5">
                            <div className="col-8 col-md-6 col-lg-4 position-relative">
                                <input
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    type="text"
                                    placeholder="Adresse email"
                                    className="mb-4 w-100 pl-5 input-signin"
                                />
                                <img src={iconUser} className="input-signin-icon" />
                            </div>
                        </div>
                        <div className="row no-gutters d-flex justify-content-center">
                            <div className="col-8 col-md-6 col-lg-4 text-center">
                                <button disabled={isInvalid} type="submit" className="btn btn-primary py-3 px-4">
                                    Modifier mot de passe
                                </button>
                            </div>
                        </div>

                        {error && <p>{error.message}</p>}
                    </form>
                </div>
            </div>

        );
    }
}

const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET} className="primary-color">Mot de passé oublié ?</Link>
    </p>
);

export default withFirebase(PasswordForget);

export { PasswordForgetLink };