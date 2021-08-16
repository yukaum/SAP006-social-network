const db = firebase.firestore();

export const getUserData = () => {
  const uid = localStorage.getItem('uid');
  const displayName = localStorage.getItem('displayName');
  return {
    uid,
    displayName,
  };
};

export const setUserData = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      localStorage.setItem('uid', user.uid);
      localStorage.setItem('displayName', user.displayName);
    }
  });
};

export const updateRecipeAuthorName = (name) => {
  db.collection('recipes').get().then((querySnapshot) => {
    querySnapshot.forEach((recipe) => {
      if (recipe.data().user_id === firebase.auth().currentUser.uid) {
        db.collection('recipes').doc(recipe.id).update({
          autor: name,
        });
      }
    });
  });
};

export const updateUserDisplayName = (data) => firebase.auth().currentUser.updateProfile({
  displayName: data,
}).then(() => updateRecipeAuthorName(data));

export const updateUserAuthEmail = (data) => firebase.auth().currentUser.updateEmail(data);

export const updateUserLevel = (data, uid) => db.collection('levels').doc(uid).set({
  level: data,
});

export const signUp = (email, password, signUpName) => firebase.auth()
  .createUserWithEmailAndPassword(email, password)
  .then(() => updateUserDisplayName(signUpName))
  .then(() => setUserData());

export const signIn = (email, password) => firebase.auth()
  .signInWithEmailAndPassword(email, password)
  .then(() => setUserData());

export const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
};

// export const signOut = () => {
//   firebase.auth().signOut().then(() => {
//     // Sign-out successful.
//   }).catch((error) => {
//     // An error happened.
//   });
// };

export const userData = (name, email, uid) => db.collection('users').doc(uid).set({
  name,
  email,
  level: '',
});

export const postRecipe = (recipe) => db.collection('recipes').add({
  likes: 0,
  comments: [],
  ...recipe,
});

export const loadRecipe = (addPost) => {
  db.collection('recipes').get().then((querySnapshot) => {
    querySnapshot.forEach((post) => {
      addPost(post);
    });
  });
};

export const deletePost = (postId) => db.collection('recipes').doc(postId).delete();

export const uploadFoodPhoto = (file) => {
  // create storage ref
  const storeageRef = firebase.storage().ref(`userRecipePhoto/ ${file.name}`);

  // upload file
  const task = storeageRef.put(file);
  return task;
};
