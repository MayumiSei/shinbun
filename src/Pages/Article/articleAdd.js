import React, { Component } from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext, withAuthorization} from '../../Components/Session';
import { Editor } from '@tinymce/tinymce-react';
import CreatableSelect from 'react-select/creatable';
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
            title: '',
            content: ''
        };
    }

    // Appelé au loading de la classe articleAdd
    componentDidMount = () => {
        this.props.firebase.categories().on('value', snapshot => {
            const categoriesObject = snapshot.val();
            // Object.keys = renvoi tableau de clés de categoriesObject
            // .map = boucle
            // map(key) = map(categoriesObject[i])
            const categoriesList = Object.keys(categoriesObject).map(key => ({
                ...categoriesObject[key],
                uid: key,
            }));
            this.setState({
                categories: categoriesList,
                // loadingUser: false,
            });
        });
    }
    
    handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
    }

    handleChange = (newValue) => {
        this.setState({categoriesSelected: newValue});
    };

    createUid = () => {
        return Math.floor(Math.random() * 100) + Date.now();
    }

    titleChange = event => {
        let targetValue = event.target.value;
        this.setState({title: targetValue});
    };

    onSubmit = event => {
        event.preventDefault();
        ;
        for(let i = 0; i < this.state.categoriesSelected.length; i++) {
            const isCategoryExists = this.state.categories.filter(item => item.uid === this.state.categoriesSelected[i].uid);
            if(isCategoryExists.length === 0) {
                this.props.firebase
                .category(this.createUid())
                .set({
                    label: this.state.categoriesSelected[i].label,
                    value: this.state.categoriesSelected[i].value
                });
            }
        }
        if(this.state.title && this.state.titlte !== '') {
            this.props.firebase
            .article(this.createUid())
            .set({
                title: this.state.title
            })
        }
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
                                    <CreatableSelect isMulti isClearable onChange={this.handleChange} options={this.state.categories} className="mb-4 select-categories"/>
                                    <input type="text" onChange={this.titleChange} className="input-title-article w-100 mb-4" required></input>
                                    <Editor initialValue="" init={ init } onEditorChange={this.handleEditorChange} />
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