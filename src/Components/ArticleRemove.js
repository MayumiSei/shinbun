import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from './Firebase';
import * as ROUTES from '../Routes';
import '../Assets/style/index.scss';
import remove from '../Assets/images/icon/article/remove.png';

class ArticleRemove extends Component {

    handleClick = event => {
        this.props.firebase.article(this.props.uid).remove();
        this.props.history.push(ROUTES.HOME);
    }

    render() {
        return(
            <button type="submit" onClick={this.handleClick} className="btn">
                 <img src={remove} alt="remove" />
            </button>
        );
    }

}

export default withRouter(withFirebase(ArticleRemove));