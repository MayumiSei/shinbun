import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext, withAuthorization} from '../../Components/Session';
import { Editor } from '@tinymce/tinymce-react';
import CreatableSelect from 'react-select/creatable';
import snapshotToArray from '../../Helpers/firebaseHelper';
import '../../Assets/style/index.scss';

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
            const articleObject = snapshot.val();
            this.setState({
                article: articleObject,
                categoriesSelected: JSON.parse(articleObject.categories),
                tagsSelected: articleObject.tags ? JSON.parse(articleObject.tags) : [],
                title: articleObject.title,
                content: articleObject.content,
                isNotPublished: articleObject.isNotPublished
            });
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
    }

    removeImage = () => {
        this.setState({imageIsRemoved: true});
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

        this.props.firebase
        .article(this.state.urlParam)
        .set({
            title: this.state.title,
            slug: this.slugify(this.state.title),
            content: this.state.content,
            categories: JSON.stringify(this.state.categoriesSelected),
            image: urlImage,
            tags: JSON.stringify(this.state.tagsSelected),
            createdAt: this.state.article.createdAt,
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
                                    <CreatableSelect isMulti isClearable onChange={this.handleChangeCategories} options={this.state.categories} value={this.state.categoriesSelected} className="mb-4 select-categories" required/>
                                    {
                                        !this.state.imageIsRemoved ?
                                            <>
                                                <img src={this.state.article.image} />
                                                <button type="button" onClick={this.removeImage}>Remove</button>
                                            </>
                                        :
                                            <input type="file" onChange={this.handleChangeUploadFile} className="w-100 mb-4" required></input>

                                    }
                                    <input type="text" onChange={this.titleChange} value={this.state.title} className="input-title-article w-100 mb-4" required></input>
                                    <Editor initialValue={this.state.content} init={this.init} onEditorChange={this.handleEditorChange} />
                                    <input name="image" type="file" id="upload" className="hidden" ref={this.imageUpload}></input>
                                    {
                                        this.state.error &&
                                            <p>{this.state.error}</p>
                                    }
                                    <CreatableSelect isMulti isClearable onChange={this.handleChangeTags} options={this.state.tags} value={this.state.tagsSelected} className="mb-4 select-tags"/>
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

export default withAuthorization(condition)(articleUpdate);