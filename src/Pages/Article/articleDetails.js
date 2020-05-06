import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext } from '../../Components/Session';
import { Link } from 'react-router-dom';
import ArticleRemove from '../../Components/ArticleRemove';
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/articleDetails.scss';
import edit from '../../Assets/images/icon/article/edit.png';

class articleDetails extends Component {
    constructor(props) {
		super(props);

		this.state = {
            article: {},
            isPrivate: false,
            urlParam: this.props.location.search.replace('?uid=', '')
        };
    }

    componentDidMount = () => {
        this.props.firebase.article(this.state.urlParam).on('value', snapshot => {
            const articleObject = snapshot.val();
            const categories = JSON.parse(articleObject.categories);
            const isPrivate = categories.filter(item => item.value === "Private");
            this.setState({
                article: articleObject,
                isPrivate: isPrivate.length > 0
            });
        });
        document.body.removeAttribute('class');
    }

    render() {
        const tags = this.state.article.tags ? JSON.parse(this.state.article.tags) : [];
        const categories = this.state.article.categories ? JSON.parse(this.state.article.categories) : [];
        return(
             <AuthUserContext.Consumer>
                {
                    authUser =>
                        <>
                            <div className="position-relative article-details-img">
                                <img src={this.state.article.image} alt={this.state.article.title} />
                                <div className="article-details-img-overlay"></div>
                            </div>
                            <div className="container">
                                <div className="row no-gutters d-flex justify-content-center">
                                    {
                                        (!this.state.isPrivate || (authUser && authUser.role === "ADMIN" && this.state.isPrivate)) ?
                                            <div className="col-12 col-xl-10 col-xxl-8 article-details-block">
                                                <div className="row no-gutters article-details-header p-3">
                                                    <div className="col-6">
                                                        <p className="m-0">{new Date(this.state.article.createdAt).toLocaleDateString()}</p>
                                                        <p className="m-0">by <span class="primary-color font-weight-bold">{this.state.article.author}</span></p>
                                                    </div>
                                                    {
                                                    (authUser && authUser.role === "ADMIN") &&
                                                    <div className="col-6 article-details-action">
                                                        <Link to={`/article/update/${this.state.urlParam}`}>
                                                            <img src={edit} className="mr-2 mr-sm-4" alt="edit" />
                                                        </Link>
                                                        <ArticleRemove uid={this.state.article.uid} />
                                                    </div>
                                                }
                                                </div>
                                                <div className="article-details-content p-3 p-sm-5">
                                                    <h1 className="h3 text-center pb-3 pb-lg-5 secondary-color">{this.state.article.title}</h1>
                                                    <div dangerouslySetInnerHTML={{__html: this.state.article.content}}></div>
                                                </div>
                                                {
                                                    (this.state.article.tags) && 
                                                    <div className="row no-gutters p-3">
                                                        {
                                                            tags.map((itemTags, index) => {
                                                                return(
                                                                    <div className="article-details-tag">
                                                                        <Link to={`/tags/${itemTags.value}?page=1`} key={index} className="white-color text-decoration-none">{itemTags.value}</Link>
                                                                    </div>
                                                                )
                                                                
                                                            })
                                                        }

                                                    </div>
                                                }
                                            </div>
                                        :
                                            <p className="mt-5">Vous n'avez pas accès à cet article.</p>
                                    }

                                </div>
                            </div>
                        </>
                }

            </AuthUserContext.Consumer>
        );
    }

}

export default withFirebase(articleDetails);