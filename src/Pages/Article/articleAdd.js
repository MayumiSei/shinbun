import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext, withAuthorization} from '../../Components/Session';
import { Editor } from '@tinymce/tinymce-react';
import CreatableSelect from 'react-select/creatable';
import snapshotToArray from '../../Helpers/firebaseHelper';
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/articleForm.scss'

const init = {
    height: 500,
    menubar: false,
    plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount',
        'code'
    ],
    toolbar: 'undo redo | formatselect | bold italic forecolor backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help | code'
}

class articleAdd extends Component {
    constructor(props) {
		super(props);

		this.state = {
            categories: [],
            categoriesSelected: [],
            tags: [],
            tagsSelected: [],
            image: '',
            title: '',
            content: '',
            articleCategory: '',
            error: '',
            isNotPublished: false
        };
    }

    // Appelé au loading de la classe articleAdd
    componentDidMount = () => {
        this.props.firebase.categories().on('value', snapshot => {
            const categories = snapshotToArray(snapshot);
            this.setState({
                categories
                // loadingUser: false,
            });
        });

        this.props.firebase.tags().on('value', snapshot => {
            const tags = snapshotToArray(snapshot);
            this.setState({
                tags
            });
        });
    }
    
    handleEditorChange = (newContent, editor) => {
        this.setState({content: newContent});
    }

    handleChangeCategories = (newValue) => {
        this.setState({categoriesSelected: newValue});
    };

    handleChangeTags = (newValue) => {
        this.setState({tagsSelected: newValue});
    };

    publishedChange = event => {
        this.setState({isNotPublished: event.target.checked});
    }

    handleChangeUploadFile = event => {
        this.setState({image: event.target.files[0]});
    }

    titleChange = event => {
        this.setState({title: event.target.value});
    };

    createUid = () => {
        return Math.floor(Math.random() * 100) + Date.now();
    }

    onSubmit = async event => {
        event.preventDefault();
        for(let i = 0; i < this.state.categoriesSelected.length; i++) {
            const isCategoryExists = this.state.categories.filter(item => item.uid === this.state.categoriesSelected[i].uid && item.value === this.state.categoriesSelected[i].value);
            if(isCategoryExists.length === 0) {
                this.props.firebase
                .category(this.createUid())
                .set({
                    label: this.state.categoriesSelected[i].label,
                    value: this.state.categoriesSelected[i].value.replace(/ /g,"-")
                });
            }
        }

        for(let i = 0; i < this.state.tagsSelected.length; i++) {
            const isTagExists = this.state.tags.filter(item => item.uid === this.state.tagsSelected[i].uid && item.value === this.state.tagsSelected[i].value);
            if(isTagExists.length === 0) {
                this.props.firebase
                .tag(this.createUid())
                .set({
                    label: this.state.tagsSelected[i].label,
                    value: this.state.tagsSelected[i].value.replace(/ /g,"-")
                });
            }
        }

        const articleUid = this.createUid();

        // On pousse l'image dans le Storage
        await this.props.firebase.articlesImg(articleUid, this.state.image.name).put(this.state.image);
        // On récupère l'URL de l'image qu'on vient de pousser dans le Storage
        const urlImage = await this.props.firebase.articlesImg(articleUid, this.state.image.name).getDownloadURL();

        if((!this.state.title && this.state.titlte === '') || (!this.state.content && this.state.content === '')) {
            return this.setState({error: "L'article n'est pas terminé"});
        }

        this.props.firebase
        .article(articleUid)
        .set({
            title: this.state.title,
            content: this.state.content,
            categories: JSON.stringify(this.state.categoriesSelected),
            image: urlImage,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            isNotPublished: this.state.isNotPublished
        })

    }

    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <div className="container">
                        {
                            (authUser && authUser.role === "ADMIN") ?
                            <div>
                                <h1>Ajouter un article</h1>
    
                                <form onSubmit={this.onSubmit}>
                                    <CreatableSelect isMulti isClearable onChange={this.handleChangeCategories} options={this.state.categories} className="mb-4 select-categories" required/>
                                    <input type="text" onChange={this.titleChange} value={this.state.title} className="input-title-article w-100 mb-4" required></input>
                                    <input type="file" onChange={this.handleChangeUploadFile} className="w-100 mb-4" required></input>
                                    <Editor initialValue="" init={ init } onEditorChange={this.handleEditorChange} />
                                    {
                                        this.state.error &&
                                            <p>{this.state.error}</p>
                                    }
                                    <CreatableSelect isMulti isClearable onChange={this.handleChangeTags} options={this.state.tags} className="mb-4 select-tags"/>
                                    <input type="checkbox" onChange={this.publishedChange} value={this.state.isNotPublished}></input>
                                    <button type="submit" className="btn">Ok</button>
                                </form>
                            </div> :
                            <p style={ { color: 'black'} }>Vous ne pouvez pas accéder à cette page</p>
                        }
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => authUser && authUser.role === "ADMIN";

export default withAuthorization(condition)(articleAdd);