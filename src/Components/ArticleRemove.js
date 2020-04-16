import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import '../Assets/style/index.scss';

class ArticleRemove extends Component {
    constructor(props) {
        super(props);
    }

    handleClick = event => {
        this.props.firebase.article(this.props.uid).remove();
    }

    render() {
        return(
            <button type="submit" onClick={this.handleClick}>Supprimer</button>
        );
    }

}

export default withFirebase(ArticleRemove);