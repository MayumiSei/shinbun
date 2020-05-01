import React, { Component } from 'react';
import { AuthUserContext, withAuthorization} from '../../Components/Session';
import { Editor } from '@tinymce/tinymce-react';
import CreatableSelect from 'react-select/creatable';
import snapshotToArray from '../../Helpers/firebaseHelper';
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/articleForm.scss';
import lineBrush from '../../Assets/images/background/default/line-brush.png';

class articleAdd extends Component {
    constructor(props) {
        super(props);
        this.imageUpload = React.createRef();

        this.init = {
            height: 500,
            menubar: false,
            paste_data_images: true,
            image_advtab: true,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
                'code'
            ],
            toolbar1: 'undo redo | formatselect | bold italic forecolor backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help | code | image',
            toolbar2: 'print preview media',
            file_picker_callback: function (callback, value, meta) {
                if (meta.filetype === 'image') {
                    // appelle la fonction file_picker_callback
                    this.imageUpload.current.click();
                    this.imageUpload.current.addEventListener('change', function () {
                        let file = this.files[0];
                        let reader = new FileReader();
                        reader.onload = function (e) {
                            callback(e.target.result, {
                                alt: 'Shinbun'
                            });
                        }
                        reader.readAsDataURL(file);
                    });
                }
            }.bind(this),
        }

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
            isNotPublished: false,
            authUser: {}
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

        this.listener = this.props.firebase.auth.onAuthStateChanged((_authUser) => {
            if(_authUser) {
                this.props.firebase.user(_authUser.uid).on("value", function(snapshot) {
                    this.setState({authUser: snapshot.val()});
                }.bind(this));
            }
        });

        document.body.removeAttribute('class');
    }
    
    componentWillUnmount() {
        this.listener();
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

    slugify(string) {
        const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
        const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
        const p = new RegExp(a.split('').join('|'), 'g')
      
        return string.toString().toLowerCase()
          .replace(/\s+/g, '-') // Replace spaces with -
          .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
          .replace(/&/g, '-and-') // Replace & with 'and'
          .replace(/[^\w\-]+/g, '') // Remove all non-word characters
          .replace(/\-\-+/g, '-') // Replace multiple - with single -
          .replace(/^-+/, '') // Trim - from start of text
          .replace(/-+$/, '') // Trim - from end of text
    }

    onSubmit = async event => {
        event.preventDefault();
        const _categoriesSelected = [...this.state.categoriesSelected];
        for(let i = 0; i < _categoriesSelected.length; i++) {
            const isCategoryExists = this.state.categories.filter(item => item.uid === _categoriesSelected[i].uid && item.value === _categoriesSelected[i].value);
            if(isCategoryExists.length === 0) {
                const categoryUid = this.createUid();
                this.props.firebase
                .category(categoryUid)
                .set({
                    label: _categoriesSelected[i].label,
                    value: _categoriesSelected[i].value.replace(/ /g,"-"),
                    uid: categoryUid
                });
                _categoriesSelected[i].uid = categoryUid;
            }
        }

        const _tagsSelected = [...this.state.tagsSelected];
        for(let i = 0; i < _tagsSelected.length; i++) {
            const isTagExists = this.state.tags.filter(item => item.uid === _tagsSelected[i].uid && item.value === _tagsSelected[i].value);
            if(isTagExists.length === 0) {
                const tagUid = this.createUid();
                this.props.firebase
                .tag(tagUid)
                .set({
                    label: _tagsSelected[i].label,
                    value: _tagsSelected[i].value.replace(/ /g,"-"),
                    uid: tagUid
                });
                _tagsSelected[i].uid = tagUid;
            }
        }

        const articleUid = this.createUid();
        const slugTitle = this.slugify(this.state.title);

        // On pousse l'image dans le Storage
        await this.props.firebase.articlesImg(articleUid, this.state.image.name).put(this.state.image);
        // On récupère l'URL de l'image qu'on vient de pousser dans le Storage
        const urlImage = await this.props.firebase.articlesImg(articleUid, this.state.image.name).getDownloadURL();

        if((!this.state.title && this.state.title === '') || (!this.state.content && this.state.content === '')) {
            return this.setState({error: "L'article n'est pas terminé"});
        }

        this.props.firebase
        .article(articleUid)
        .set({
            title: this.state.title,
            slug: slugTitle,
            author: this.state.authUser.username,
            content: this.state.content,
            categories: _categoriesSelected.length > 0 ? JSON.stringify(_categoriesSelected) : [],
            image: urlImage,
            tags: _tagsSelected.length > 0 ? JSON.stringify(_tagsSelected) : [],
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            isNotPublished: this.state.isNotPublished,
            uid: articleUid
        })
        .then(() => {
            this.props.history.push(`/${_categoriesSelected[0].value}/article/${slugTitle}?uid=${articleUid}`);
        })

    }

    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <div>
                        <div className="top-background top-background-home">
                            <div className="top-background-overlay"></div>
                            <div className="font-primary text-center">
                                <h1 className="font-weight-bold">Adding</h1>
                                <p className="h4">— Add a new article —</p>
                            </div>
                            <img src={lineBrush} className="line-brush" alt="brush" />
                        </div>
                        <div className="container container-margin">
                            {
                                (authUser && authUser.role === "ADMIN") ?
                                <div>
        
                                    <form onSubmit={this.onSubmit} className="article-form">
                                        <h2 className="secondary-color h3">Catégorie(s)*</h2>
                                        <CreatableSelect isMulti isClearable onChange={this.handleChangeCategories} options={this.state.categories} className="mb-4 select-categories" required/>
                                        <h2 className="secondary-color h3">Titre*</h2>
                                        <input type="text" onChange={this.titleChange} value={this.state.title} className="input-form w-100 mb-4" required></input>
                                        <h2 className="secondary-color h3">Image*</h2>
                                        <input type="file" onChange={this.handleChangeUploadFile} className="w-100 mb-4" required></input>
                                        <h2 className="secondary-color h3">Contenu*</h2>
                                        <Editor initialValue="" init={this.init} onEditorChange={this.handleEditorChange} />
                                        <input name="image" type="file" id="upload" className="hidden" ref={this.imageUpload}></input>
                                        {
                                            this.state.error &&
                                                <p>{this.state.error}</p>
                                        }
                                        <h2 className="secondary-color h3 mt-4">Tag(s)</h2>
                                        <CreatableSelect isMulti isClearable onChange={this.handleChangeTags} options={this.state.tags} className="mb-4 select-tags"/>
                                        <div>
                                            <input type="checkbox" onChange={this.publishedChange} value={this.state.isNotPublished}></input>
                                            <span className="secondary-color h4 ml-4">Mettre en brouillon</span>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <button type="submit" className="btn btn-primary add-btn">
                                                <span className="h3">Publier</span>
                                            </button>
                                        </div>
                                    </form>
                                </div> :
                                <p style={ { color: 'black'} }>Vous ne pouvez pas accéder à cette page</p>
                            }
                        </div>
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => authUser && authUser.role === "ADMIN";

export default withAuthorization(condition)(articleAdd);
