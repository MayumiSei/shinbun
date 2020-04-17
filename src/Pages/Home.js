import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../Routes';
import { AuthUserContext} from '../Components/Session';
import { withFirebase } from '../Components/Firebase';
import snapshotToArray from '../Helpers/firebaseHelper';
import ArticleRemove from '../Components/ArticleRemove';
import '../Assets/style/index.scss';

class Home extends Component {
    constructor(props) {
		super(props);

		this.state = {
            articles: [],
        };
    }

    componentDidMount = () => {
        this.props.firebase.articles().on('value', snapshot => {
            const articles  = snapshotToArray(snapshot);
            this.setState({articles: articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())});
        });
    }

    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <div className="container">
                        <h1>test</h1>
                        {
                            (authUser && authUser.role === "ADMIN") &&
                            <Link to={ROUTES.ARTICLEADD}>Ajouter un article</Link>
                        }
                        <div className="row no-gutters">
                        {
                            this.state.articles.map((item, index) => (
                                index <= 10 &&
                                    <div key={index} className="col-12 col-md-6 article-list">
                                        {
                                            (authUser && authUser.role === "ADMIN") &&
                                                <ArticleRemove uid={item.uid}></ArticleRemove>
                                        }
                                        
                                        <Link to={`/article/${item.slug}?uid=${item.uid}`}>
                                            <div className="article-block">
                                                
                                                <img src={item.image} />
                                                <h2>{item.title}</h2>
                                                <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                                                <p dangerouslySetInnerHTML={{__html: item.content}}></p>
                                            </div>
                                        </Link>
                                    </div>
                            ))
                        }
                        </div>
                    </div>
                }
    
            </AuthUserContext.Consumer>
        );
    }

}

export default withFirebase(Home);
