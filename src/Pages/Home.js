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
            console.log('articles ', articles);
            const articlesFiltered = articles.filter(item => item.isNotPublished === false);
            const articlesSort = articlesFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            this.setState({articles: articlesSort});
        });

        document.body.removeAttribute('class');
        document.body.classList.add('background-default');
    }

    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <div className="container container-margin">
                        {
                            (authUser && authUser.role === "ADMIN") &&
                            <Link to={ROUTES.ARTICLEADD}>Ajouter un article</Link>
                        }
                        <div className="row no-gutters">
                        {
                            this.state.articles.map((item, index) => {
                                const categories = JSON.parse(item.categories);
                                return(
                                    index <= 10 &&
                                    <div key={index} className="col-12 col-lg-6 col-xxl-4 article-list">
                                        {/* {
                                            (authUser && authUser.role === "ADMIN") &&
                                                <ArticleRemove uid={item.uid}></ArticleRemove>
                                        } */}
                                        <div className="article-block">
                                            <Link to={`/${categories[0].value}/article/${item.slug}?uid=${item.uid}`} className="text-decoration-none">   
                                                <img src={item.image} className="article-img" />
                                                <div className="article-content p-3">
                                                    <h2>{item.title}</h2>
                                                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                                                    {/* <p dangerouslySetInnerHTML={{__html: item.content}}></p> */}

                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                )

                            })
                        }
                        </div>
                    </div>
                }
    
            </AuthUserContext.Consumer>
        );
    }

}

export default withFirebase(Home);
