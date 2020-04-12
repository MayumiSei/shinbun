import React from 'react';
import '../../Assets/style/index.scss';
import { withFirebase } from '../../Components/Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../Routes';
import { AuthUserContext, withAuthorization} from '../../Components/Session';

const articleAdd = (props) => {
    return(
        <AuthUserContext.Consumer>
            {
                authUser =>
                    (authUser && authUser.role === "ADMIN") ?
                    <div>
                        <h1>Article Add</h1>
                    </div> :
                    <p style={ { color: 'black'} }>Vous ne pouvez pas accéder à cette page</p>


            }

        </AuthUserContext.Consumer>
    );
}

const condition = authUser => authUser && authUser.role === "ADMIN";

export default withAuthorization(condition)(articleAdd);