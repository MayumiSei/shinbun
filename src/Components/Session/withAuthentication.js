import React from 'react';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                authUser: null,
            };
        }

        componentDidMount() {
            this.props.firebase.auth.onAuthStateChanged( async (_authUser) => {
                if(_authUser) {
                    this.props.firebase.user(_authUser.uid).on("value", function(snapshot) {
                        this.setState({authUser: snapshot.val()});
                    }.bind(this));
                }
            });
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }
    
    return withFirebase(WithAuthentication);
};

export default withAuthentication;