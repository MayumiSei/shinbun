import React, { Component } from 'react';
import { AuthUserContext} from '../Components/Session';
import { withFirebase } from '../Components/Firebase';
import snapshotToArray from '../Helpers/firebaseHelper';
import ArticleCard from '../Components/articleCard'
import Footer from '../Components/Footer';
import '../Assets/style/index.scss';
import lineBrush from '../Assets/images/background/default/line-brush.png';

class Home extends Component {
    constructor(props) {
		super(props);

		this.state = {
            articles: [],
        };
    }

    componentDidMount = () => {
        this.props.firebase.articles().on('value', snapshot => {
            const articles  = snapshotToArray(snapshot);
            const articlesFiltered = articles.filter(item => {
                let categoriesArray = JSON.parse(item.categories);
                const isPrivate = categoriesArray.filter(item => item.value === "Private");
                return (item.isNotPublished === false && isPrivate.length === 0);
            });
            const articlesSort = articlesFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            this.setState({articles: articlesSort});
        });

        document.body.removeAttribute('class');
    }

    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <div className="">
                        <div className="top-background top-background-default">
                            <div className="top-background-overlay"></div>
                            <div className="font-primary text-center">
                                <h1 className="font-weight-bold">explore</h1>
                                <p className="h4">— A brand new world —</p>
                            </div>
                            <img src={lineBrush} className="line-brush" alt="brush" />
                        </div>
                        <div className="container">
                            <h2 className="text-center font-weight-bold secondary-color my-5">The latest articles</h2>
                                <div className="row no-gutters">
                                {
                                    this.state.articles.map((item, index) => {
                                        const categories = JSON.parse(item.categories);
                                        return(
                                            index <= 2 &&
                                            <div key={index} className="col-12 col-lg-6 col-xxl-4 article-list">
                                                <ArticleCard item={item} categories={categories} linkArticle={`/${categories[0].value}/article/${item.slug}?uid=${item.uid}`} />
                                            </div>
                                        )

                                    })
                                }
                            </div>
                        </div>
                        <Footer></Footer>
                    </div>
                }
    
            </AuthUserContext.Consumer>
        );
    }

}

export default withFirebase(Home);
