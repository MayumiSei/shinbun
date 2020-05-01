import React, { Component } from 'react';
// import { PasswordForgetForm } from '../Components/PasswordForget';
// import PasswordChangeForm from '../Components/PasswordChange';
import { AuthUserContext} from '../Components/Session';
import { withFirebase } from '../Components/Firebase';
import snapshotToArray from '../Helpers/firebaseHelper';
import { Link } from 'react-router-dom';
// import Pagination from "react-js-pagination";
import * as ROUTES from '../Routes';
import Footer from '../Components/Footer';
import '../Assets/style/index.scss';
import '../Assets/style/articles/articlesList.scss';
import '../Assets/style/pagination.scss';
import '../Assets/style/account.scss';
import lineBrush from '../Assets/images/background/default/line-brush.png';

class Account extends Component {

    constructor(props) {
		super(props);

		this.state = {
            categories: [],
            tags: [],
            articles: [],
            articlesSort: [],
            categoryName: '',
            tagName: '',
            isOpenCategory: '',
            isOpenTag: '',
            itemsCountPerPage: 10,
            // articlePaginate: [],
            authUser: {}
        };
    }

    componentDidUpdate = (oldProps, newState) => {
        if((oldProps.match.params.categories && oldProps.match.params.categories !== this.props.match.params.categories) || this.props.location.search.replace('?page=', '') !== oldProps.location.search.replace('?page=', '')) {
            this.props.firebase.articles().on('value', snapshot => {
                const articles = snapshotToArray(snapshot);
                const articlesFiltered = articles.filter(item => item.isNotPublished === true);
                const articleSort = articlesFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
                const start = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1);
                const indexEnd = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1) + this.state.itemsCountPerPage;
                const end = articleSort.length < indexEnd ? articleSort.length : indexEnd;
                const articlePaginate = articleSort.slice(start, end);
                this.setState({
                    articles: articleSort,
                    articlePaginate: articlePaginate
                });
            });
        }
    }

    componentDidMount = () => {
        this.props.firebase.categories().on('value', snapshot => {
            const categories = snapshotToArray(snapshot);
            this.setState({
                categories
            });
        });

        this.props.firebase.tags().on('value', snapshot => {
            const tags = snapshotToArray(snapshot);
            this.setState({
                tags
            });
        });

        this.props.firebase.articles().on('value', snapshot => {
            const articles = snapshotToArray(snapshot);
            const articlesFiltered = articles.filter(item => item.isNotPublished === true);
            const articleSort = articlesFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // const start = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1);
            // const indexEnd = this.state.itemsCountPerPage * (Number(this.props.location.search.replace('?page=', '')) - 1) + this.state.itemsCountPerPage;
            // const end = articleSort.length < indexEnd ? articleSort.length : indexEnd;
            // const articlePaginate = articleSort.slice(start, end);
            this.setState({
                articles: articles,
                articlesSort: articleSort,
                // articlePaginate: articlePaginate
            });
        });

        this.listener = this.props.firebase.auth.onAuthStateChanged((_authUser) => {
            if(_authUser) {
                this.props.firebase.user(_authUser.uid).on("value", function(snapshot) {
                    this.setState({authUser: snapshot.val()});
                }.bind(this));
            }
        });

        console.log('this ', this.props.location)

        document.body.removeAttribute('class');
    }

    componentWillUnmount() {
        this.listener();
    }

    handleCategoryRemove = uid => {
        this.state.articles.map((itemArticle, key) => {
            const categoriesArray = JSON.parse(itemArticle.categories);
            categoriesArray.map((itemCategoryArticle, key) => {
                if(uid === itemCategoryArticle.uid) {
                    categoriesArray.splice(key, 1);
                    if(categoriesArray.length === 0) {
                        this.state.categories.map((itemCategory, key) => {
                            if(itemCategory.label === "Archive") {
                                categoriesArray.push(itemCategory);
                            }
                        });
                    }
                    itemArticle.categories = JSON.stringify(categoriesArray);
                    console.log('itemArticle ', itemArticle.categories);
                    this.props.firebase
                    .article(itemArticle.uid)
                    .set(
                        itemArticle
                    )
                }
            });
        });
        this.props.firebase.category(uid).remove();
    }

    handleClickUpdateCategory = item => {
        this.setState({
            isOpenCategory: item.uid,
            categoryName: item.label
        });
    }

    categoryNameChange = event => {
        this.setState({categoryName: event.target.value});
    }

    handleCategoryUpdate = uid => {
        this.state.articles.map((itemArticle, key) => {
            let categoriesArray = JSON.parse(itemArticle.categories);

            for(let i = 0; i < categoriesArray.length; i++) {
                if(uid === categoriesArray[i].uid) {
                    categoriesArray[i].label = this.state.categoryName
                    categoriesArray[i].value = this.state.categoryName.replace(/ /g,"-")

                    itemArticle.categories = JSON.stringify(categoriesArray);
                    this.props.firebase.article(itemArticle.uid)
                    .set(
                        itemArticle
                    )
                }
            }
        });

        this.props.firebase.category(uid)
        .set({
            label: this.state.categoryName,
            value: this.state.categoryName.replace(/ /g,"-"),
            uid
        })

        this.setState({isOpenCategory: ''});
    }

    handleTagRemove = uid => {
        this.state.articles.map((itemArticle, key) => {
            if(itemArticle.tags) {
                const tagsArray = JSON.parse(itemArticle.tags);
                tagsArray.map((itemTagArticle, key) => {
                    if(uid === itemTagArticle.uid) {
                        tagsArray.splice(key, 1);
                        itemArticle.tags = JSON.stringify(tagsArray);
                        this.props.firebase
                        .article(itemArticle.uid)
                        .set(
                            itemArticle
                        )
                    }
                });
            }
        });
        this.props.firebase.tag(uid).remove();
    }

    handleClickUpdateTag = item => {
        this.setState({
            isOpenTag: item.uid,
            tagName: item.label
        });
    }

    tagNameChange = event => {
        this.setState({tagName: event.target.value});
    }

    handleTagUpdate = uid => {
        this.state.articles.map((itemArticle, key) => {
            if(itemArticle.tags) {
                let tagsArray = JSON.parse(itemArticle.tags);

                for(let i = 0; i < tagsArray.length; i++) {
                    if(uid === tagsArray[i].uid) {
                        tagsArray[i].label = this.state.tagName
                        tagsArray[i].value = this.state.tagName.replace(/ /g,"-")
    
                        itemArticle.tags = JSON.stringify(tagsArray);
                        this.props.firebase.article(itemArticle.uid)
                        .set(
                            itemArticle
                        )
                    }
                }
            }
        });

        this.props.firebase.tag(uid)
        .set({
            label: this.state.tagName,
            value: this.state.tagName.replace(/ /g,"-"),
            uid
        })

        this.setState({isOpenTag: ''});
    }

    handlePageChange(pageNumber) {
        this.props.history.push(`${ROUTES.ACCOUNT}?page=${pageNumber}`);
        this.setState({currentPage: pageNumber});
    }


    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <div>
                        <div className="top-background top-background-home">
                            <div className="top-background-overlay"></div>
                            <div className="font-primary text-center">
                                <h1 className="font-weight-bold">Account</h1>
                                <p className="h4">— All about your informations —</p>
                            </div>
                            <img src={lineBrush} className="line-brush" alt="brush" />
                        </div>
                        <div className="container mt-4">
                            {/* <PasswordForgetForm />
                            <PasswordChangeForm /> */}
                            {
                                authUser &&
                                    <>
                                        <div className="row no-gutters d-flex justify-content-center">
                                            <div className="col-12 col-md-7 col-lg-5 col-xxl-3">
                                                <p>Mon identifiant : <span className="secondary-color">{this.state.authUser.username}</span></p>
                                                <p>Mon email : <span className="secondary-color">{this.state.authUser.email}</span></p>
                                                <p>Mon rôle : <span className="secondary-color">{this.state.authUser.role}</span></p>
                                            </div>
                                            <div className="col-12">
                                            </div>
                                        </div>
                                        <hr />
                                    </>
                            }
                            {
                                (authUser && authUser.role === "ADMIN") &&
                                    <>
                                    <div className="row no-gutters">
                                        <ul className="list-unstyled col-12 col-md-5">
                                            {
                                                this.state.categories.map((item, index) => (
                                                    <li key={index} className="mb-4">
                                                        {
                                                            this.state.isOpenCategory === item.uid ?
                                                            <div className="">
                                                                <input type="text" onChange={this.categoryNameChange} value={this.state.categoryName} className="input-form mr-3"></input>
                                                                <button type="submit" onClick={this.handleCategoryUpdate.bind(this, item.uid)} className="btn btn-primary mr-3">Ok</button>
                                                            </div>
                                                            :
                                                            <>
                                                                <span className="mr-4">{item.label}</span>
                                                                <button type="submit" onClick={this.handleClickUpdateCategory.bind(this, item)} className="btn btn-primary mr-3">Update</button>
                                                            </>
                                                        }
                                                        <button type="submit" onClick={this.handleCategoryRemove.bind(this, item.uid)} className="btn btn-primary-border">Supprimer</button>
                                                        
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                        <div className="vertical-hr hide-xs hide-sm col-md-2"></div>
                                        <ul className="list-unstyled col-12 col-md-5">
                                            {
                                                this.state.tags.map((item, index) => (
                                                    <li key={index} className="mb-4">
                                                        {
                                                            this.state.isOpenTag === item.uid ?
                                                            <div className="">
                                                                <input type="text" onChange={this.tagNameChange} value={this.state.tagName} className="input-form mr-3"></input>
                                                                <button type="submit" onClick={this.handleTagUpdate.bind(this, item.uid)} className="btn btn-primary mr-3">Ok</button>
                                                            </div>
                                                            :
                                                            <>
                                                                <span className="mr-4">{item.label}</span>
                                                                <button type="submit" onClick={this.handleClickUpdateTag.bind(this, item)} className="btn btn-primary mr-3">Update</button>
                                                            </>
                                                        }
                                                        <button type="submit" onClick={this.handleTagRemove.bind(this, item.uid)} className="btn btn-primary-border">Supprimer</button>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
  
                                        {
                                            this.state.articlesSort.length > 0 &&
                                                <div className="row no-gutters mt-5">
                                                    {
                                                        this.state.articlesSort.map((item, index) => {
                                                            const categories = JSON.parse(item.categories);
                                                            return(
                                                                <div key={index} className="col-12 col-lg-6 col-xxl-4 article-list">
                                                                    <div className="article-block position-relative">
                                                                        <Link to={`/${categories[0].value}/article/${item.slug}?uid=${item.uid}`} className="text-decoration-none">   
                                                                            <div className="position-relative h-100">
                                                                                <img src={item.image} className="article-img" alt={item.title} />
                                                                                <div className="img-overlay"></div>
                                                                            </div>
                                                                            <div className="article-categories">
                                                                                {
                                                                                    categories.map((category, index) => {
                                                                                        return(
                                                                                            <img src={require(`../Assets/images/icon/categories/${category.value}.png`)} alt={item.category.value} />
                                                                                        )
                                                                                    })
                                                                                }
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
                                                            )
                        
                                                        })
                                                    }
                                                </div>
                                        }
                                    
                                    {/* <Pagination
                                        activePage={Number(this.props.location.search.replace('?page=', ''))}
                                        itemsCountPerPage={this.state.itemsCountPerPage}
                                        totalItemsCount={this.state.articles.length}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange.bind(this)}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        hideDisabled={true} /> */}
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

export default withFirebase(Account);