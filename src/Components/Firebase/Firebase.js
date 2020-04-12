import app from 'firebase/app';

const config = {
    apiKey: 'AIZASYAY0DN-4RNIMYYK40EEUUSIKAQR8FMRVFA',
    authDomain: 'PROJECT-216520449094',
    databaseURL: 'HTTPS://SHINBUN-SEI.FIREBASEIO.COM',
    projectId: 'SHINBUN-SEI',
    storageBucket: '',
    messagingSenderId: '216520449094',
};

class Firebase {
    constructor() {
      app.initializeApp(config);
    }
 }

 export default Firebase;