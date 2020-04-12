import React from 'react';
import '../Assets/style/index.scss';
import { withFirebase } from './Firebase';
import { AuthUserContext } from './Session';

const Header = (props) => {
    return(
        <AuthUserContext.Consumer>
            {
                authUser =>
                <header>
                    <div className="container">
                        <h1>Shinbun</h1>
                        {
                            authUser && <SignOutButton />
                        }
                    </div>
                </header>
            }

        </AuthUserContext.Consumer>
    );
}

const SignOutButtonBase = ({ firebase }) => (
    <button type="button" onClick={firebase.doSignOut}>
        Sign Out
    </button>
);

const SignOutButton = withFirebase(SignOutButtonBase);

export default Header;