import React from 'react';
import { withFirebase } from '../../Components/Firebase';
import { AuthUserContext, withAuthorization} from '../../Components/Session';
import { Editor } from '@tinymce/tinymce-react';
import CreatableSelect from 'react-select/creatable';
import '../../Assets/style/index.scss';
import '../../Assets/style/articles/tinymce.scss'

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

const categories = [
    {
        label: 'Japon',
        value: 'japon'
    },
    {
        label: 'Mythologie',
        value: 'mythologie'
    }
]

const articleAdd = (props) => {
    const handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
    }

    const handleChange = (newValue, actionMeta) => {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
    };

    return(
        <AuthUserContext.Consumer>
            {
                authUser =>
                <div className="container">
                    {
                        (authUser && authUser.role === "ADMIN") ?
                        <div>
                            <h1>Article Add</h1>

                            <form onSubmit="">
                                <CreatableSelect isMulti isClearable onChange={handleChange} options={categories} className="mb-4"/>
                                <Editor initialValue="<p>This is the initial content of the editor</p>" init={ init } onEditorChange={handleEditorChange} />
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

const condition = authUser => authUser && authUser.role === "ADMIN";

export default withAuthorization(condition)(articleAdd);