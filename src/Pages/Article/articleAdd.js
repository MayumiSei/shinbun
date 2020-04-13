import React from 'react';
import '../../Assets/style/index.scss';
import { withFirebase } from '../../Components/Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../Routes';
import { AuthUserContext, withAuthorization} from '../../Components/Session';
import { Editor } from '@tinymce/tinymce-react';

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

const ArticleAdd = (props) => {
    const handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
    }

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

                                <Editor initialValue="<p>This is the initial content of the editor</p>" init={ init } onEditorChange={handleEditorChange} />

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

export default withAuthorization(condition)(ArticleAdd);