import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext } from '../../Components/Session';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../Routes';
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
                                        (authUser && authUser.role === "ADMIN" && this.state.isPrivate) ?
                                            <div className="col-12 col-xl-10 col-xxl-8 article-details-block p-5">
                                                {
                                                    (authUser && authUser.role === "ADMIN") &&
                                                    <div className="article-details-action">
                                                        <Link to={`/article/update/${this.state.urlParam}`}>
                                                            <img src={edit} className="mr-4" alt="edit" />
                                                        </Link>
                                                        <ArticleRemove uid={this.state.article.uid} />
                                                    </div>
                                                }
                                                <h1 className="h3 text-center pb-3 pb-lg-5">{this.state.article.title}</h1>
                                                <div dangerouslySetInnerHTML={{__html: this.state.article.content}}></div>
                                                {
                                                    (this.state.article.tags) && 
                                                    tags.map((itemTags, index) => {
                                                        return(
                                                            <Link to={`/tags/${itemTags.value}?page=1`} key={index}>{itemTags.value}</Link>
                                                        )
                                                        
                                                    })
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