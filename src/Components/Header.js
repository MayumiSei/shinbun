import React from 'react';
import '../Assets/style/index.scss';
import { withFirebase } from './Firebase';
import { AuthUserContext} from './Session';
import { Link } from 'react-router-dom';
import * as ROUTES from '../Routes';

const Header = (props) => {
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
                    </div>
                </header>
            }

        </AuthUserContext.Consumer>
    );
}

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

export default Header;