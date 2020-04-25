import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext, withAuthorization} from '../../Components/Session';
import { Link } from 'react-router-dom';
import ArticleRemove from '../../Components/ArticleRemove';
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/articleDetails.scss';
import edit from '../../Assets/images/icon/article/edit.png';
import remove from '../../Assets/images/icon/article/remove.png';

class articleDetails extends Component {
    constructor(props) {
		super(props);

		this.state = {
            article: {},
            urlParam: this.props.location.search.replace('?uid=', '')
        };
    }

    componentDidMount = () => {
        this.props.firebase.article(this.state.urlParam).on('value', snapshot => {
            const articleObject = snapshot.val();
            this.setState({article: articleObject});
        });
        document.body.removeAttribute('class');
    }

    render() {
        return(
             <AuthUserContext.Consumer>
                {
                    authUser =>
                        <>
                            <div className="position-relative article-details-img">
                                <img src={this.state.article.image} />
                                <div className="article-details-img-overlay"></div>
                            </div>
                            <div className="container">
                                <div className="row no-gutters d-flex justify-content-center">
                                    <div className="col-12 col-xl-10 col-xxl-8 article-details-block p-5">
                                        {
                                            (authUser && authUser.role === "ADMIN") &&
                                            <div className="article-details-action">
                                                <Link to={`/article/update/${this.state.urlParam}`}>
                                                    <img src={edit} className="mr-4" />
                                                </Link>
                                                <ArticleRemove uid={this.state.article.uid}>
                                                    {/* <img src={remove} /> */}
                                                </ArticleRemove>
                                            </div>
                                        }
                                        <h1 className="h3 text-center pb-3 pb-lg-5">{this.state.article.title}</h1>
                                        <div dangerouslySetInnerHTML={{__html: this.state.article.content}}></div>
                                    </div>
                                </div>
                            </div>
                        </>
                }

            </AuthUserContext.Consumer>
        );
    }

}

export default withFirebase(articleDetails);