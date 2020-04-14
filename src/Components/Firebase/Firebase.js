import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage'

const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
	constructor() {
		app.initializeApp(config);

		this.auth = app.auth();
		this.database = app.database();
		this.storage = app.storage();
	}

	// *** Auth API ***
	doCreateUserWithEmailAndPassword = (email, password) =>
		this.auth.createUserWithEmailAndPassword(email, password);

	doSignInWithEmailAndPassword = (email, password) =>
		this.auth.signInWithEmailAndPassword(email, password);

	doSignOut = () => this.auth.signOut();

	doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

	doPasswordUpdate = password =>
		this.auth.currentUser.updatePassword(password);

	// *** Database API ***
	user = uid => this.database.ref(`users/${uid}`);
	users = () => this.database.ref('users');
	
	category = uid => this.database.ref(`categories/${uid}`);
	categories = () => this.database.ref('categories');

	tag = uid => this.database.ref(`tags/${uid}`);
	tags = () => this.database.ref('tags');

	article = uid => this.database.ref(`articles/${uid}`);
	articles = () => this.database.ref('articles');

	// *** Storage API ***

	articlesImg = (articleUid, imgName) => this.storage.ref(`articles/${articleUid}/${imgName}`);
}

export default Firebase;