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
                    <div className="header-container-padding">
                        {/* <div className="background-categories background-default"></div> */}
                        <div className="container container-margin">
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
                                            <div className="article-block position-relative">
                                                <Link to={`/${categories[0].value}/article/${item.slug}?uid=${item.uid}`} className="text-decoration-none">   
                                                    <div className="position-relative">
                                                        <img src={item.image} className="article-img" />
                                                        <div className="img-overlay"></div>
                                                    </div>
                                                    
                                                    <div className="article-content position-absolute">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                                                            <path fill="#ffffff" fill-opacity="0.6" d="M0,320L60,282.7C120,245,240,171,360,144C480,117,600,139,720,170.7C840,203,960,245,1080,240C1200,235,1320,181,1380,154.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                                                        </svg>
                                                        <div className="article-content-details p-3">
                                                            <h2>{item.title}</h2>
                                                            <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    )

                                })
                            }
                            </div>
                        </div>
                    </div>
                }
    
            </AuthUserContext.Consumer>
        );
    }

}

export default withFirebase(Home);
