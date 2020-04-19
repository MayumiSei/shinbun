import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import { AuthUserContext} from './Session';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../Routes';
import snapshotToArray from '../Helpers/firebaseHelper';
import '../Assets/style/index.scss';
import '../Assets/style/header.scss';

class Header extends Component {
    constructor(props) {
		super(props);

		this.state = {
            categories: [],
            openMenu: false
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

    handleSignOut = (e) => {
        e.preventDefault();
        this.setState({openMenu: false});
        this.props.firebase.doSignOut();
        window.location = '/';
    }

    handleMenu = e => {
        e.preventDefault();
        this.setState({openMenu: !this.state.openMenu});
    }

    handleModal = (route, e) => {
        e.preventDefault();
        this.setState({openMenu: false})
        this.props.history.push(route);
    }

    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <>
                        <header>
                            <div className="container py-2">
                                <div className="position-relative">
                                    <h1 className="font-brush h2 py-3 text-center">
                                        <Link to={ROUTES.HOME} className="darker-color text-decoration-none">Shinbun</Link>
                                    </h1>
                                    <svg className={this.state.openMenu ? 'ham hamRotate ham1 active' : 'ham hamRotate ham1'} viewBox="0 0 100 100" width="60" onClick={this.handleMenu} >
                                        <path
                                                className="line top"
                                                d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40" />
                                        <path
                                                className="line middle"
                                                d="m 30,50 h 40" />
                                        <path
                                                className="line bottom"
                                                d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40" />
                                    </svg>
                                </div>

                                <nav className="Menu hide-xs hide-sm hide-md">
                                    <ul className="list-unstyled li-inline m-0 split-list nav-split">
                                        <li className="split-list-item">
                                            <Link to={ROUTES.HOME} className="text-decoration-none">
                                                Accueil
                                                <span className="Mask"><span>Accueil</span></span>
                                                <span className="Mask"><span>Accueil</span></span>
                                            </Link>
                                        </li>
                                        {
                                            this.state.categories.map((item, index) => {
                                                return(
                                                    <li key={index} className={item.value === "Archive" && (!authUser || authUser.role !== "ADMIN") ? "d-none" : "split-list-item"}>
                                                        <Link to={`/${item.value}?page=1`}className="text-decoration-none">
                                                            {item.label}
                                                            <span className="Mask"><span>{item.label}</span></span>
                                                            <span className="Mask"><span>{item.label}</span></span>
                                                        </Link>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </nav>
                            </div>
                        </header>
                        <div className={this.state.openMenu ? 'modal-menu menu-open' :  'modal-menu d-none'}>
                            <ul className="list-unstyled m-0 split-list burger-menu-split">
                                {
                                    this.state.categories.map((item, index) => {
                                        return(
                                            <li key={index} className={item.value === "Archive" && (!authUser || authUser.role !== "ADMIN") ? "d-none" : "split-list-item"}>
                                                <Link to={`/${item.value}?page=1`} className="text-decoration-none">
                                                    {item.label}
                                                    <span className="Mask"><span>{item.label}</span></span>
                                                    <span className="Mask"><span>{item.label}</span></span>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }

                                {
                                    authUser ?
                                    <>
                                        <li className="text-uppercase split-list-item">
                                            <a href="#" className="text-decoration-none" onClick={this.handleModal.bind(this, ROUTES.ACCOUNT)}>
                                                Mon compte
                                                <span className="Mask"><span>Mon compte</span></span>
                                                <span className="Mask"><span>Mon compte</span></span>
                                            </a>
                                        </li>
                                        <li className="text-uppercase split-list-item">
                                            <a href="#" className="text-decoration-none" onClick={this.handleSignOut}>
                                                Se déconnecter
                                                <span className="Mask"><span>Se déconnecter</span></span>
                                                <span className="Mask"><span>Se déconnecter</span></span>
                                            </a>
                                        </li>
                                    </>
                                    :
                                        <li className="text-uppercase split-list-item">
                                            <a href="#" className="text-decoration-none" onClick={this.handleModal.bind(this, `${ROUTES.SIGNIN}?page=1`)}>
                                                Se connecter
                                                <span className="Mask"><span>Se connecter</span></span>
                                                <span className="Mask"><span>Se connecter</span></span>
                                            </a>
                                        </li>
                                }
                            </ul>
                        </div>
                    </>
                }
    
            </AuthUserContext.Consumer>
        );
    }

}

export default withRouter(withFirebase(Header));