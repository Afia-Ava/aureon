// Firebase Storage upload and profile photo update utility
// Copy this code to your profile.html and call uploadAndSetProfilePhoto(file, user)

// 1. Add Firebase Storage SDK in your <head>:
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js"></script>

// 2. Utility to resize/compress image
function resizeImage(file, maxSize = 256, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const reader = new FileReader();
        reader.onload = function(e) {
            img.onload = function() {
                let w = img.width, h = img.height;
                if (w > h) {
                    if (w > maxSize) { h *= maxSize / w; w = maxSize; }
                } else {
                    if (h > maxSize) { w *= maxSize / h; h = maxSize; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 3. Upload to Firebase Storage and update profile
async function uploadAndSetProfilePhoto(file, user) {
    if (!firebase.storage) throw new Error('Firebase Storage SDK not loaded');
    const storageRef = firebase.storage().ref();
    const photoRef = storageRef.child('profile_photos/' + user.uid + '.jpg');
    const resizedBlob = await resizeImage(file);
    await photoRef.put(resizedBlob);
    const url = await photoRef.getDownloadURL();
    await user.updateProfile({ photoURL: url });
    return url;
}

// Usage example (in your profile.html):
// fileInput.addEventListener('change', async (e) => {
//   const file = e.target.files[0];
//   if (file && auth.currentUser) {
//     await uploadAndSetProfilePhoto(file, auth.currentUser);
//     // Optionally refresh UI
//   }
// });
