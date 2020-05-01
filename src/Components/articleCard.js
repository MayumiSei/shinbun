import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../Assets/style/index.scss';
import '../Assets/style/articles/articlesList.scss';

class ArticleCard extends Component {
    constructor(props) {
		super(props);

		this.state = {
            isDefault: false
        };
    }


    componentDidMount = () => {

    }


    render() {
        return(
            <div className="article-block position-relative">
                <Link to={this.props.linkArticle} className="text-decoration-none">
                    <div className="position-relative h-100">
                        <img src={this.props.item.image} className="article-img" alt={this.props.item.title} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="article-date">
                        <span>{new Date(this.props.item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="article-categories">
                        {
                            this.props.categories.map((category, index) => {
                                return(
                                    <img src={require(`../Assets/images/icon/categories/${category.value}.png`)} alt={category.value} />
                                )
                            })
                        }
                    </div>
                    <div className="article-content position-absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                            <path fill="#ffffff" fill-opacity="0.6" d="M0,320L60,282.7C120,245,240,171,360,144C480,117,600,139,720,170.7C840,203,960,245,1080,240C1200,235,1320,181,1380,154.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                        </svg>
                        <div className="article-content-details p-3">
                            <h2 className="h4">{this.props.item.title}</h2>
                        </div>
                    </div>
                </Link>
            </div>
        )
            
    }

}

export default ArticleCard;