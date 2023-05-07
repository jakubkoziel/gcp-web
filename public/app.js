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

createApp({
  data() {
    return {
      files: [],
      user: undefined,
    }
  },

  methods: {
    // async submitFile() {
    //   let imageToUpload = this.$refs.file.files[0];
    //   const imageId = crypto.randomUUID();
    //   const storage = getStorage(firebaseApp);
    //   const imageToUploadRef = ref(storage, 'original_images/' + imageId);
    //   const metadata = {
    //     customMetadata: {
    //       generation: 1,
    //       original_name: imageToUpload.name,
    //       image_id: imageId,
    //     }
    //   };
    //
    //   await uploadBytes(imageToUploadRef, imageToUpload, metadata);
    //   await this.listFiles();
    // },

    async listFiles() {
      const storage = getStorage(firebaseApp);
      const originalImagesRef = ref(storage, 'original_images/');
      let originalImages = await listAll(originalImagesRef);
      let newImages = [];
      let requests = originalImages.items.map(async (originalImageRef) => {
        const [url, metadata] =
          await Promise.all(
            [getDownloadURL(originalImageRef), getMetadata(originalImageRef)]);

        const generatedImagesRef = ref(storage, 'generated_images/' + originalImageRef.name);
        let generatedImages = await listAll(generatedImagesRef);

        const generatedImagesUrlAndMetadata = await Promise.all(
          generatedImages.items.map(
            generatedImageRef =>
              Promise.all(
                [getDownloadURL(generatedImageRef), getMetadata(generatedImageRef)])));

        const generatedImagesUrlAndPrompt =
          generatedImagesUrlAndMetadata.map(item => {
            return { url: item[0], prompt: item[1].customMetadata.prompt };
          });

        newImages.push(
          {
            name: originalImageRef.name,
            url: url,
            prompt: metadata.customMetadata.prompt,
            generatedImages: generatedImagesUrlAndPrompt
          });
      });

      await Promise.all(requests);

      newImages.sort((a, b) => a.name < b.name ? 1 : -1);
      this.files = newImages;
    },

    async signOut() {
      await signOut(firebaseAuth);
    }
  },

  async mounted() {
    this.page = window.location.hash != "" ? window.location.hash : "#task";
    window.addEventListener('hashchange', () => {
      this.page = window.location.hash
    });

    onAuthStateChanged(firebaseAuth, (user) => {
      this.user = user;
    });

    var ui = new firebaseui.auth.AuthUI(firebaseAuth);
    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        }
      ],
      signInSuccessUrl: window.location.origin + "#demo"
    });

    await this.listFiles();
  }
}).mount('#app');