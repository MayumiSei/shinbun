import React, { Component } from 'react';
import { PasswordForgetForm } from '../Components/PasswordForget';
import PasswordChangeForm from '../Components/PasswordChange';
import { AuthUserContext} from '../Components/Session';
import { withFirebase } from '../Components/Firebase';
import snapshotToArray from '../Helpers/firebaseHelper';

class Account extends Component {

    constructor(props) {
		super(props);

		this.state = {
            categories: [],
            tags: [],
            articles: [],
            categoryName: '',
            isOpen: ''
        };
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
            this.setState({
                articles
            });
        });
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

    handleClickUpdate = item => {
        this.setState({
            isOpen: item.uid,
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

        this.setState({isOpen: ''});
    }

    handleTagRemove = uid => {
        const tag = this.state.articles.map((item, key) => {
            if(item.tags) {
                const tagsList = JSON.parse(item.tags);
            }
        });
        // this.props.firebase.tag(uid).remove();
    }

    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <div className="container">
                        <h1>Account Page</h1>
                        <PasswordForgetForm />
                        <PasswordChangeForm />
                        {
                            (authUser && authUser.role === "ADMIN") &&
                                <>
                                    <ul className="list-unstyled">
                                        {
                                            this.state.categories.map((item, index) => {
                                                return(
                                                    <li key={index} className="js-category-update">
                                                        {
                                                            this.state.isOpen === item.uid ?
                                                            <div className="">
                                                                <input type="text" onChange={this.categoryNameChange} value={this.state.categoryName}></input>
                                                                <button type="submit" onClick={this.handleCategoryUpdate.bind(this, item.uid)}>Ok</button>
                                                            </div>
                                                            :
                                                            <>
                                                                <span>{item.label}</span>
                                                                <button type="submit" onClick={this.handleClickUpdate.bind(this, item)}>Update</button>
                                                            </>
                                                        }
                                                        <button type="submit" onClick={this.handleCategoryRemove.bind(this, item.uid)}>Supprimer</button>
                                                        
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    <hr />
                                    <ul className="list-unstyled">
                                        {
                                            this.state.tags.map((item, index) => {
                                                return(
                                                    <li key={index}>
                                                        <span>{item.label}</span>
                                                        <button type="submit" onClick={this.handleTagRemove.bind(this, item.uid)}>Supprimer</button>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </>

                        }
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(Account);