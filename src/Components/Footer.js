import React, { Component } from 'react';
import { Link, withRouter, NavLink } from 'react-router-dom';
import * as ROUTES from '../Routes';
import '../Assets/style/index.scss';
import '../Assets/style/footer.scss';
import lineBrushReverse from '../Assets/images/background/default/line-brush-reverse.png';

class Footer extends Component {
    constructor(props) {
		super(props);

		this.state = {
            isDefault: false
        };
    }

    componentDidUpdate = (oldProps) => {
        if(oldProps.location.pathname !== this.props.location.pathname) {
            let routes = this.props.location.pathname;
            if(routes === "/Occultisme" || routes === "/Japon" || routes === "/Northern") {
                this.setState({isDefault: false});
            } else {
                this.setState({isDefault: true});
            }
        }
    }

    componentDidMount = () => {
        let routes = this.props.location.pathname;
        console.log('routes ', routes)
        if(routes === "/Occultisme" || routes === "/Japon" || routes === "/Northern") {
            this.setState({isDefault: false});
        } else {
            this.setState({isDefault: true});
        }
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
            <div className={this.state.isDefault ? 'bottom-background bottom-background-default' : 'bottom-background bottom-background-' + this.props.match.params.categories}>
                <img src={lineBrushReverse} className="line-brush-reverse" />
                <p className="white-color footer-copyright m-0">© Shinbun 2020</p>
            </div>
        )
            
    }

}

export default withRouter(Footer);