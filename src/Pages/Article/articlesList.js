import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext} from '../../Components/Session';
import snapshotToArray from '../../Helpers/firebaseHelper';
import { Link } from 'react-router-dom';
import ArticleRemove from '../../Components/ArticleRemove';
import Pagination from "react-js-pagination";
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/articlesList.scss';

class articlesList extends Component {
    constructor(props) {
		super(props);

		this.state = {
            articles: [],
            itemsCountPerPage: 10,
            articlePaginate: [],
            offset: 0
        };
    }

    // Fonction appelé après que le component ait été updaté
    componentDidUpdate = (oldProps, newState) => {
        // Si l'url d'avant et différent du nouvel url, alors on refiltre les articles
        if((oldProps.match.params.categories && oldProps.match.params.categories !== this.props.match.params.categories) || this.props.location.search.replace('?page=', '') !== oldProps.location.search.replace('?page=', '')) {
            this.props.firebase.articles().on('value', snapshot => {
                const articles  = snapshotToArray(snapshot);
                const articlesFiltered = articles.filter(item => {
                    let categoriesArray = JSON.parse(item.categories);
                    const categoriesFiltered = categoriesArray.filter(item => item.value === this.props.match.params.categories);
                    return (categoriesFiltered[0] && categoriesFiltered[0].value === this.props.match.params.categories) && item.isNotPublished === false;
                });
                const articleSort = articlesFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                const start = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1);
                const indexEnd = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1) + this.state.itemsCountPerPage
                const end = articleSort.length < indexEnd ? articleSort.length : indexEnd
                const articlePaginate = articleSort.slice(start, end);

                this.setState({
                    articles: articleSort,
                    articlePaginate: articlePaginate
                });
            });
        }
    }

    componentDidMount = () => {
        this.props.firebase.articles().on('value', snapshot => {
            const articles  = snapshotToArray(snapshot);
            const articlesFiltered = articles.filter(item => {
                let categoriesArray = JSON.parse(item.categories);
                const categoriesFiltered = categoriesArray.filter(item => item.value === this.props.match.params.categories);
                return (categoriesFiltered[0] && categoriesFiltered[0].value === this.props.match.params.categories) && item.isNotPublished === false;
            });
            const articleSort = articlesFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const start = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1);
            const indexEnd = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1) + this.state.itemsCountPerPage
            const end = articleSort.length < indexEnd ? articleSort.length : indexEnd
            const articlePaginate = articleSort.slice(start, end);

            this.setState({
                articles: articleSort,
                articlePaginate: articlePaginate
            });
        });
    }

    handlePageChange(pageNumber) {
        this.props.history.push(`${this.props.match.params.categories}?page=${pageNumber}`);
        this.setState({currentPage: pageNumber});
    }

    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <div className="container">
                        {
                            this.state.articlePaginate.length > 0 &&
                            <>
                                <div className="row no-gutters">
                                {
                                    this.state.articlePaginate.map((item, index) => (
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
                                <div>
                                    <Pagination
                                        activePage={Number(this.props.location.search.replace('?page=', ''))}
                                        itemsCountPerPage={this.state.itemsCountPerPage}
                                        totalItemsCount={this.state.articles.length}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange.bind(this)}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        hideDisabled={true}
                                    />
                                </div>
                            </>
                        }
                </div>
                }
            </AuthUserContext.Consumer>
        );
    }

}

export default withFirebase(articlesList);