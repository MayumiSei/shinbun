import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext} from '../../Components/Session';
import snapshotToArray from '../../Helpers/firebaseHelper';
import { Link } from 'react-router-dom';
import ArticleRemove from '../../Components/ArticleRemove';
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/articlesList.scss';

class articlesList extends Component {
    constructor(props) {
		super(props);

		this.state = {
            articles: [],
        };
    }

    // Fonction appelé après que le component ait été updaté
    componentDidUpdate = (oldProps, newState) => {
        // Si l'url d'avant et différent du nouvel url, alors on refiltre les articles
        if(oldProps.match.params.categories && oldProps.match.params.categories !== this.props.match.params.categories) {
            this.props.firebase.articles().on('value', snapshot => {
                const articles  = snapshotToArray(snapshot);
                const articlesFiltered = articles.filter(item => {
                    let categoriesArray = JSON.parse(item.categories);
                    const categoriesFiltered = categoriesArray.filter(item => item.value === this.props.match.params.categories);
                    return categoriesFiltered[0] && categoriesFiltered[0].value === this.props.match.params.categories;
                });
                this.setState({articles: articlesFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())});
            });
        }
    }

    componentDidMount = () => {
        this.props.firebase.articles().on('value', snapshot => {
            const articles  = snapshotToArray(snapshot);
            const articlesFiltered = articles.filter(item => {
                let categoriesArray = JSON.parse(item.categories);
                const categoriesFiltered = categoriesArray.filter(item => item.value === this.props.match.params.categories);
                return categoriesFiltered[0] && categoriesFiltered[0].value === this.props.match.params.categories;
            });
            this.setState({articles: articlesFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())});
        });
    }

    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <div className="container">
                    <div className="row no-gutters">
                        {
                            this.state.articles.map((item, index) => {
                                return(
                                    <div key={index} className="col-12 col-md-6 article-list">
                                        {
                                            (authUser && authUser.role === "ADMIN") &&
                                                <ArticleRemove uid={item.uid}></ArticleRemove>
                                        }
                                        
                                        <Link to={`/${this.props.match.params.categories}/${item.slug}?uid=${item.uid}`}>
                                            <div className="article-block">
                                                
                                                <img src={item.image} />
                                                <h2>{item.title}</h2>
                                                <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                                                <p dangerouslySetInnerHTML={{__html: item.content}}></p>
                                            </div>
                                        </Link>
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

export default withFirebase(articlesList);