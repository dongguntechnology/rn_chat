import {initializeApp} from 'firebase/app';

const firebaseConfig = {
   apiKey: 'AIzaSyCMizsNYXtU5F2VOBYJG56TOUfumfF-WuI',
   authDomain: 'todolist-424af.firebaseapp.com',
   databaseURL: 'https://todolist-424af-default-rtdb.firebaseio.com',
   projectId: 'todolist-424af',
   storageBucket: 'todolist-424af.appspot.com',
   messagingSenderId: '81519576325',
   appId: '1:81519576325:web:4d70c2d0a2f517a6bc236c',
};

// init firebase app
export const app = initializeApp(firebaseConfig);
