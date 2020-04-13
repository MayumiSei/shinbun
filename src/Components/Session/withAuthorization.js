import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../Routes';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged((authUser) => {
                if(authUser) {
                    this.props.firebase.user(authUser.uid).on("value", function(snapshot) {
                        const user = snapshot.val();
                        if(!condition(user)) {
                            this.props.history.push(ROUTES.HOME);
                        }
                    }.bind(this));
                } else {
                    this.props.history.push(ROUTES.HOME);
                }
            });
        }

        componentWillUnmount() {
            this.listener();
        }
        
        render() {
            return (
                <Component {...this.props} />
            );
        }
    }

    return compose(
        withRouter,
        withFirebase,
    )(WithAuthorization);
};

export default withAuthorization;