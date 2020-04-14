import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import snapshotToArray from '../../Helpers/firebaseHelper';
import '../../Assets/style/index.scss';

class articlesList extends Component {
    constructor(props) {
		super(props);

		this.state = {
            articles: []
        };
    }

    componentDidMount = () => {
        const urlParam = this.props.match.params.categories;
        this.props.firebase.articles().on('value', snapshot => {
            const articles  = snapshotToArray(snapshot);
            const articlesFiltered = articles.filter(item => {
                let categoriesArray = JSON.parse(item.categories);
                const categoriesFiltered = categoriesArray.filter(item => item.value === urlParam);
                return categoriesFiltered[0] && categoriesFiltered[0].value === urlParam;
            });
            this.setState({articles: articlesFiltered});
            console.log('articles ', articlesFiltered)
        });
    }

    render() {
        return(
            <div className="container">
                {
                    this.state.articles.map((item, index) => {
                        return(
                            <div key={index}>
                            </div>
                        )
                    })
                }
            </div>
        );
    }

}

export default withFirebase(articlesList);