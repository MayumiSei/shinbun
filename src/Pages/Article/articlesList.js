import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext} from '../../Components/Session';
import snapshotToArray from '../../Helpers/firebaseHelper';
import Pagination from "react-js-pagination";
import Footer from '../../Components/Footer';
import ArticleCard from '../../Components/articleCard';
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/articlesList.scss';
import '../../Assets/style/pagination.scss';
import lineBrush from '../../Assets/images/background/default/line-brush.png';

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
                    const isPrivate = categoriesArray.filter(item => item.value === "Private");
                    const isPrivateUrl = this.props.match.params.categories === "Private";
                    if(isPrivate && isPrivateUrl) {
                        return (categoriesFiltered[0] && categoriesFiltered[0].value === this.props.match.params.categories) && item.isNotPublished === false;
                    } else {
                        return (categoriesFiltered[0] && categoriesFiltered[0].value === this.props.match.params.categories) && item.isNotPublished === false && isPrivate.length === 0;
                    }
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
        }
    }

    componentDidMount = () => {
        this.props.firebase.articles().on('value', snapshot => {
            const articles  = snapshotToArray(snapshot);
            const articlesFiltered = articles.filter(item => {
                let categoriesArray = JSON.parse(item.categories);
                const categoriesFiltered = categoriesArray.filter(item => item.value === this.props.match.params.categories);
                const isPrivate = categoriesArray.filter(item => item.value === "Private");
                const isPrivateUrl = this.props.match.params.categories === "Private";
                if(isPrivate && isPrivateUrl) {
                    return (categoriesFiltered[0] && categoriesFiltered[0].value === this.props.match.params.categories) && item.isNotPublished === false;
                } else {
                    return (categoriesFiltered[0] && categoriesFiltered[0].value === this.props.match.params.categories) && item.isNotPublished === false && isPrivate.length === 0;
                }
                // return (categoriesFiltered[0] && categoriesFiltered[0].value === this.props.match.params.categories) && item.isNotPublished === false && isPrivate.length === 0;
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
                            <img src={lineBrush} className="line-brush" alt="brush" />
                        </div>
                        <div className="container mt-5">
                        {
                            this.state.articlePaginate.length > 0 &&
                            <>
                                <div className="row no-gutters">
                                {
                                    this.state.articlePaginate.map((item, index) => {
                                        const categories = JSON.parse(item.categories);
                                            return(
                                                <div key={index} className="col-12 col-lg-6 col-xxl-4 article-list">
                                                    {/* {
                                                        (authUser && authUser.role === "ADMIN") &&
                                                            <ArticleRemove uid={item.uid}></ArticleRemove>
                                                    } */}
                                                    
                                                    <ArticleCard item={item} categories={categories} linkArticle={`/${this.props.match.params.categories}/article/${item.slug}?uid=${item.uid}`} />
                                                </div>
                                            )
                                        })
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
                    <Footer></Footer>
                </div>
                }
            </AuthUserContext.Consumer>
        );
    }

}

export default withFirebase(articlesList);