import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import { AuthUserContext} from './Session';
import { Link } from 'react-router-dom';
import * as ROUTES from '../Routes';
import snapshotToArray from '../Helpers/firebaseHelper';
import '../Assets/style/index.scss';
import '../Assets/style/header.scss';

class Header extends Component {
    constructor(props) {
		super(props);

		this.state = {
            categories: []
        };
    }

    componentDidMount = () => {
        this.props.firebase.categories().on('value', snapshot => {
            const categories = snapshotToArray(snapshot);
            this.setState({
                categories
            });
        });
    }

    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <header>
                        <div className="container">
                            <h1>Shinbun</h1>
                            {
                                authUser &&
                                <>
                                    <SignOutButton />
                                    <Link to={`${ROUTES.ACCOUNT}?page=1`}>Compte</Link>
                                </>
                            }
                            {
                                (authUser && authUser.role === "ADMIN") &&
                                    <p style={ {color: 'black'} }>Admin</p>
                            }

                            <ul className="list-unstyled li-inline ul-header">
                                {
                                    this.state.categories.map((item, index) => {
                                        return(
                                            <li key={index}>
                                                <Link to={`/${item.value}?page=1`}>{item.label}</Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </header>
                }
    
            </AuthUserContext.Consumer>
        );
    }

}

// Composant
const SignOutButtonBase = (props) => {
    const handleSignOut = () => {
        props.firebase.doSignOut();
        window.location = '/';
    }

    return(
        <button type="button" onClick={handleSignOut}>
            Sign Out
        </button>
    );
}

const SignOutButton = withFirebase(SignOutButtonBase);

export default withFirebase(Header);