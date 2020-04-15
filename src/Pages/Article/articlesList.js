import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import snapshotToArray from '../../Helpers/firebaseHelper';
import { Link } from 'react-router-dom';
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/articlesList.scss';

class articlesList extends Component {
    constructor(props) {
		super(props);

		this.state = {
            articles: [],
            urlParam: props.match.params.categories
        };
    }

    componentDidMount = () => {
        this.props.firebase.articles().on('value', snapshot => {
            const articles  = snapshotToArray(snapshot);
            const articlesFiltered = articles.filter(item => {
                let categoriesArray = JSON.parse(item.categories);
                const categoriesFiltered = categoriesArray.filter(item => item.value === this.state.urlParam);
                return categoriesFiltered[0] && categoriesFiltered[0].value === this.state.urlParam;
            });
            this.setState({articles: articlesFiltered});
            console.log('articles ', articlesFiltered);
        });
    }

    render() {
        return(
            <div className="container">
                <div className="row no-gutters">
                    {
                        this.state.articles.map((item, index) => {
                            return(
                                <div key={index} className="col-12 col-md-6 article-list">
                                    <Link to={`/${this.state.urlParam}/${item.slug}?uid=${item.uid}`}>
                                        <div className="article-block">
                                            <img src={item.image} />
                                            <h2>{item.title}</h2>
                                            <p dangerouslySetInnerHTML={{__html: item.content}}></p>
                                        </div>
                                    </Link>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }

}

export default withFirebase(articlesList);