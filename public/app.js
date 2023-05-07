import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL, getMetadata } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

const firebaseConfig = {
           apiKey: "AIzaSyDQsgKdvCWBud-JBAHFJaVosJr9oBCWVjA",
           authDomain: "colorizephotos-385720.firebaseapp.com",
           projectId: "colorizephotos-385720",
           storageBucket: "colorizephotos-385720-new",
           messagingSenderId: "801196932289",
           appId: "1:801196932289:web:003038dc79f5d4ee75e840",
           measurementId: "G-J8TFWCNPRM"
       };

const firebaseApp = initializeApp(firebaseConfig);
