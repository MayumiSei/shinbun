import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { Link } from 'react-router-dom';
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/articlesList.scss';

class articleDetails extends Component {
    constructor(props) {
		super(props);

		this.state = {
            article: {},
            urlParam: this.props.location.search.replace('?uid=', '')
        };
    }

    componentDidMount = () => {
        this.props.firebase.article(this.state.urlParam).on('value', snapshot => {
            const articleObject = snapshot.val();
            this.setState({article: articleObject});
            console.log('state ', this.state.article);
        });

    }

    render() {
        return(
            <div className="container">
                <div className="row no-gutters">
                    <div className="col-12">
                        <Link to={`/article/update/${this.state.urlParam}`}>Update</Link>
                        <h1 className="h3">{this.state.article.title}</h1>
                        <img src={this.state.article.image} />
                        <div dangerouslySetInnerHTML={{__html: this.state.article.content}}></div>
                    </div>
                </div>
            </div>
        );
    }

}

export default withFirebase(articleDetails);