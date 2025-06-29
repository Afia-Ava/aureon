// Requires: firebase-app-compat.js, firebase-auth-compat.js, firebase-firestore-compat.js, firebase-secrets.js

(function() {
    if (typeof firebaseConfig === 'undefined' || typeof firebase === 'undefined') return;
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    function setNavProfilePhoto(user) {
        if (!user) return;
        db.collection('users').doc(user.uid).get().then(doc => {
            const data = doc.data();
            if (data && data.photoBase64) {
                const navProfilePhoto = document.getElementById('navProfilePhoto');
                if (navProfilePhoto) navProfilePhoto.src = data.photoBase64;
            }
        });
    }

    auth.onAuthStateChanged(function(user) {
        setNavProfilePhoto(user);
    });
})();
