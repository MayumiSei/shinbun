import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext, withAuthorization} from '../../Components/Session';
import { Editor } from '@tinymce/tinymce-react';
import CreatableSelect from 'react-select/creatable';
import snapshotToArray from '../../Helpers/firebaseHelper';
import '../../Assets/style/index.scss';
import lineBrush from '../../Assets/images/background/default/line-brush.png';

class articleUpdate extends Component {
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
                if (meta.filetype == 'image') {
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
            article: {},
            image: '',
            title: '',
            content: '',
            imageIsRemoved: false,
            urlParam: this.props.match.params.uid
        };
    }

    componentDidMount = () => {
        this.props.firebase.article(this.state.urlParam).on('value', snapshot => {
            if(snapshot.val()) {
                const articleObject = snapshot.val();
                this.setState({
                    article: articleObject,
                    categoriesSelected: JSON.parse(articleObject.categories),
                    tagsSelected: articleObject.tags ? JSON.parse(articleObject.tags) : [],
                    title: articleObject.title,
                    content: articleObject.content,
                    isNotPublished: articleObject.isNotPublished
                });
            }

        });

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

        document.body.removeAttribute('class');
    }

    handleEditorChange = (newContent, editor) => {
        this.setState({content: newContent});
    }

    handleChangeCategories = (newValue) => {
        this.setState({categoriesSelected: newValue});
    };

    handleChangeTags = (newValue) => {
        this.setState({tagsSelected: newValue ? newValue : []});
    };

    publishedChange = event => {
        this.setState({isNotPublished: event.target.checked});
    }

    handleChangeUploadFile = event => {
        this.setState({image: event.target.files[0]});
    }

    titleChange = event => {
        this.setState({title: event.target.value});
    }

    removeImage = () => {
        this.setState({imageIsRemoved: true});
    }

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
            const isCategoryExists = this.state.categories.filter(item => item.value === _categoriesSelected[i].value);
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
        if(this.state.tagsSelected.length > 0) {
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
        }

        let urlImage;
        if(this.state.imageIsRemoved) {
            // On pousse l'image dans le Storage
            await this.props.firebase.articlesImg(this.state.urlParam, this.state.image.name).put(this.state.image);
            // On récupère l'URL de l'image qu'on vient de pousser dans le Storage
            urlImage = await this.props.firebase.articlesImg(this.state.urlParam, this.state.image.name).getDownloadURL();
        } else {
            urlImage = this.state.article.image;
        }

        if((!this.state.title && this.state.titlte === '') || (!this.state.content && this.state.content === '')) {
            return this.setState({error: "L'article n'est pas terminé"});
        }

        const slugTitle = this.slugify(this.state.title);

        this.props.firebase
        .article(this.state.urlParam)
        .set({
            title: this.state.title,
            slug: slugTitle,
            author: this.state.article.author,
            content: this.state.content,
            categories: _categoriesSelected.length > 0 ? JSON.stringify(_categoriesSelected) : [],
            image: urlImage,
            tags: _tagsSelected.length > 0 ? JSON.stringify(_tagsSelected) : [],
            createdAt: this.state.article.createdAt,
            updatedAt: new Date().toString(),
            isNotPublished: this.state.isNotPublished,
            uid: this.state.urlParam
        })
        .then(() => {
            this.props.history.push(`/${_categoriesSelected[0].value}/article/${slugTitle}?uid=${this.state.article.uid}`);
        })

    }


    render() {
        return(
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <div className="">
                        <div className="top-background top-background-home">
                            <div className="top-background-overlay"></div>
                            <div className="font-primary text-center">
                                <h1 className="font-weight-bold">Editing</h1>
                                <p className="h4">— Edit and improve an article —</p>
                            </div>
                            <img src={lineBrush} className="line-brush" />
                        </div>
                        <div className="container container-margin">
                            {
                                (authUser && authUser.role === "ADMIN") ?
                                <div>
                                    <form onSubmit={this.onSubmit}>
                                        <h2 className="secondary-color h3">Catégorie(s)*</h2>
                                        <CreatableSelect isMulti isClearable onChange={this.handleChangeCategories} options={this.state.categories} value={this.state.categoriesSelected} className="mb-4 select-categories" required/>
                                        <h2 className="secondary-color h3">Titre*</h2>
                                        <input type="text" onChange={this.titleChange} value={this.state.title} className="input-form w-100 mb-4" required></input>
                                        <h2 className="secondary-color h3">Image*</h2>
                                        {
                                            !this.state.imageIsRemoved ?
                                                <>
                                                <div className="update-article-img mb-4">
                                                    <img src={this.state.article.image} className="update-article-img" />
                                                    <button type="button" onClick={this.removeImage} className="btn btn-primary">
                                                        <span className="h4">Supprimer</span>
                                                    </button>
                                                </div>
                                                </>
                                            :
                                                <input type="file" onChange={this.handleChangeUploadFile} className="w-100 mb-4" required></input>

                                        }
                                        <h2 className="secondary-color h3">Contenu*</h2>
                                        <Editor initialValue={this.state.content} init={this.init} onEditorChange={this.handleEditorChange} />
                                        <input name="image" type="file" id="upload" className="hidden" ref={this.imageUpload}></input>
                                        {
                                            this.state.error &&
                                                <p>{this.state.error}</p>
                                        }
                                        <h2 className="secondary-color h3 mt-4">Tag(s)</h2>
                                        <CreatableSelect isMulti isClearable onChange={this.handleChangeTags} options={this.state.tags} value={this.state.tagsSelected} className="mb-4 select-tags"/>
                                        <div>
                                            <input type="checkbox" onChange={this.publishedChange} checked={this.state.isNotPublished}></input>
                                            <span className="secondary-color h4 ml-4">Mettre en brouillon</span>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <button type="submit" className="btn btn-primary add-btn">
                                                <span className="h3">Editer</span>
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

export default withAuthorization(condition)(articleUpdate);