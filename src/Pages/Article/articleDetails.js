import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { Link } from 'react-router-dom';
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/articleDetails.scss';

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
    }

    render() {
        return(
            <>
                <div className="position-relative">
                    <img src={this.state.article.image} className="article-detail-img" />
                    <div className="article-detail-img-overlay"></div>
                </div>
                <div className="container">
                    <div className="row no-gutters d-flex justify-content-center">
                        <div className="col-12 col-xl-10 col-xxl-8 article-detail-block p-5">
                            <h1 className="h3 text-center pb-3 pb-lg-5">{this.state.article.title}</h1>
                            <div dangerouslySetInnerHTML={{__html: this.state.article.content}}></div>
                            <Link to={`/article/update/${this.state.urlParam}`}>Update</Link>
                        </div>
                    </div>
                </div>

            </>
            // <div className="container header-container-padding">
            //     <div className="row no-gutters articleDetail">
            //         <div className="col-12 col-lg-8 articleDetail-block">
            //             <div className="articleDetail-img">
            //                 <img src={this.state.article.image} className="articleDetail-img"/>
            //             </div>
            //             <div className="articleDetail-content p-3">
            //                 <h1 className="h3 text-center pb-3 pb-lg-5">{this.state.article.title}</h1>
            //                 <div dangerouslySetInnerHTML={{__html: this.state.article.content}}></div>
            //                 <Link to={`/article/update/${this.state.urlParam}`}>Update</Link>
            //             </div>
            //         </div>
            //     </div>
            // </div>
        );
    }

}

export default withFirebase(articleDetails);