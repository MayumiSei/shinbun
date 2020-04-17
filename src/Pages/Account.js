import React, { Component } from 'react';
import { PasswordForgetForm } from '../Components/PasswordForget';
import PasswordChangeForm from '../Components/PasswordChange';
import { AuthUserContext} from '../Components/Session';
import { withFirebase } from '../Components/Firebase';
import snapshotToArray from '../Helpers/firebaseHelper';
import { Link } from 'react-router-dom';
import '../Assets/style/index.scss';
import '../Assets/style/articles/articlesList.scss';

class Account extends Component {

    constructor(props) {
		super(props);

		this.state = {
            categories: [],
            tags: [],
            articles: [],
            categoryName: '',
            tagName: '',
            isOpenCategory: '',
            isOpenTag: ''
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
                                            this.state.categories.map((item, index) => (
                                                <li key={index}>
                                                    {
                                                        this.state.isOpenCategory === item.uid ?
                                                        <div className="">
                                                            <input type="text" onChange={this.categoryNameChange} value={this.state.categoryName}></input>
                                                            <button type="submit" onClick={this.handleCategoryUpdate.bind(this, item.uid)}>Ok</button>
                                                        </div>
                                                        :
                                                        <>
                                                            <span>{item.label}</span>
                                                            <button type="submit" onClick={this.handleClickUpdateCategory.bind(this, item)}>Update</button>
                                                        </>
                                                    }
                                                    <button type="submit" onClick={this.handleCategoryRemove.bind(this, item.uid)}>Supprimer</button>
                                                    
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    <hr />
                                    <ul className="list-unstyled">
                                        {
                                            this.state.tags.map((item, index) => (
                                                <li key={index}>
                                                    {
                                                        this.state.isOpenTag === item.uid ?
                                                        <div className="">
                                                            <input type="text" onChange={this.tagNameChange} value={this.state.tagName}></input>
                                                            <button type="submit" onClick={this.handleTagUpdate.bind(this, item.uid)}>Ok</button>
                                                        </div>
                                                        :
                                                        <>
                                                            <span>{item.label}</span>
                                                            <button type="submit" onClick={this.handleClickUpdateTag.bind(this, item)}>Update</button>
                                                        </>
                                                    }
                                                    <button type="submit" onClick={this.handleTagRemove.bind(this, item.uid)}>Supprimer</button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    {
                                        this.state.articles.map((item, index) => (
                                            // item.isNotPublished &&
                                                <div className="row no-gutters">
                                                    <Link to={`/${this.props.match.params.categories}/${item.slug}?uid=${item.uid}`}>
                                                        <div className="article-block">
                                                            <img src={item.image} />
                                                            <h2>{item.title}</h2>
                                                            <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                                                            <p dangerouslySetInnerHTML={{__html: item.content}}></p>
                                                        </div>
                                                    </Link>
                                                </div>
                                        ))
                                    }
                                </>

                        }
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(Account);