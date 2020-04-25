import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext} from '../../Components/Session';
import snapshotToArray from '../../Helpers/firebaseHelper';
import { Link } from 'react-router-dom';
import ArticleRemove from '../../Components/ArticleRemove';
import Pagination from "react-js-pagination";
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/articlesList.scss';
import '../../Assets/style/pagination.scss';
import lineBrush from '../../Assets/images/background/homePage/line-brush.png';

class articlesList extends Component {
    constructor(props) {
		super(props);

		this.state = {
            articles: [],
            itemsCountPerPage: 10,
            articlePaginate: [],
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
                const articlesSort = articlesFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                const start = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1);
                const indexEnd = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1) + this.state.itemsCountPerPage
                const end = articlesSort.length < indexEnd ? articlesSort.length : indexEnd
                const articlePaginate = articlesSort.slice(start, end);

                this.setState({
                    articles: articlesSort,
                    articlePaginate: articlePaginate
                });
            });

            document.body.removeAttribute('class');
            // document.body.classList.add('background-' + this.props.match.params.categories);
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
            const articlesSort = articlesFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const start = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1);
            const indexEnd = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1) + this.state.itemsCountPerPage
            const end = articlesSort.length < indexEnd ? articlesSort.length : indexEnd
            const articlePaginate = articlesSort.slice(start, end);

            this.setState({
                articles: articlesSort,
                articlePaginate: articlePaginate
            });
        });

        document.body.removeAttribute('class');
        // document.body.classList.add('background-' + this.props.match.params.categories);
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
                    <div className="">
                        <div className={`top-background top-background-articlesList top-background-${this.props.match.params.categories}`}>
                            <div className="top-background-overlay"></div>
                            <div className="font-primary text-center">
                                <h1 className="font-weight-bold">{this.props.match.params.categories}</h1>
                            </div>
                            <img src={lineBrush} className="line-brush" />
                        </div>
                        {/* <div class="overlay overlay-background"></div> */}
                        {/* <div className={`background-categories background-${this.props.match.params.categories}`}></div> */}
                        <div className="container">
                        {
                            this.state.articlePaginate.length > 0 &&
                            <>
                                <div className="row no-gutters">
                                {
                                    this.state.articlePaginate.map((item, index) => (
                                                <div key={index} className="col-12 col-lg-6 col-xxl-4 article-list">
                                                    {/* {
                                                        (authUser && authUser.role === "ADMIN") &&
                                                            <ArticleRemove uid={item.uid}></ArticleRemove>
                                                    } */}
                                                    
                                                    
                                                    <div className="article-block position-relative">
                                                        <Link to={`/${this.props.match.params.categories}/article/${item.slug}?uid=${item.uid}`} className="text-decoration-none">
                                                            <div className="position-relative h-100">
                                                                <img src={item.image} className="article-img" />
                                                                <div className="img-overlay"></div>
                                                            </div>
                                                            <div className="article-date">
                                                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="article-content position-absolute">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                                                                    <path fill="#ffffff" fill-opacity="0.6" d="M0,320L60,282.7C120,245,240,171,360,144C480,117,600,139,720,170.7C840,203,960,245,1080,240C1200,235,1320,181,1380,154.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                                                                </svg>
                                                                <div className="article-content-details p-3">
                                                                    <h2 className="h4">{item.title}</h2>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    
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
                </div>
                }
            </AuthUserContext.Consumer>
        );
    }

}

export default withFirebase(articlesList);