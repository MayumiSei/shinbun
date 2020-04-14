import React, { Component } from 'react';
import '../Assets/style/index.scss';
import '../Assets/style/header.scss'
import { withFirebase } from './Firebase';
import { AuthUserContext} from './Session';
import { Link } from 'react-router-dom';
import * as ROUTES from '../Routes';

class Header extends Component {
    constructor(props) {
		super(props);

		this.state = {
            categories: []
        };
    }

    componentDidMount = () => {
        this.props.firebase.categories().on('value', snapshot => {
            const categoriesObject = snapshot.val();
            const categoriesList = Object.keys(categoriesObject).map(key => ({
                ...categoriesObject[key],
                uid: key
            }));
            this.setState({
                categories: categoriesList
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
                                    <Link to={ROUTES.ACCOUNT}>Compte</Link>
                                </>
                            }
                            {
                                (authUser && authUser.role === "ADMIN") &&
                                    <p style={ {color: 'black'} }>Admin</p>
                            }

                            <ul className="list-unstyled li-inline ul-header">
                                {
                                    this.state.categories.map((item, index) => {
                                        return <li key={index}>{item.label}</li>
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