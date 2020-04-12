import React from 'react';
import '../Assets/style/index.scss';
import { Link } from 'react-router-dom';
import * as ROUTES from '../Routes';
import { AuthUserContext} from '../Components/Session';

const Home = (props) => {
    return(
        <AuthUserContext.Consumer>
            {
                authUser =>
                <div>
                    <h1>test</h1>
                    {
                        (authUser && authUser.role === "ADMIN") &&
                        <Link to={ROUTES.ARTICLEADD}>Ajouter un article</Link>
                    }
                </div>
            }

        </AuthUserContext.Consumer>
    );
}

export default Home;
