import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";

import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  signOut
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

import { 
  getFirestore, 
  setDoc, 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";


// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRd2jxpG86-Qstd1fwCtrn9SWe1QplKcs",
  authDomain: "travelease-login-1fca0.firebaseapp.com",
  projectId: "travelease-login-1fca0",
  storageBucket: "travelease-login-1fca0.appspot.com",
  messagingSenderId: "950095058508",
  appId: "1:950095058508:web:d398bf6ef38174759d46e9",
  measurementId: "G-GKRGVKQ2C7"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

function showMessage(message, divId) {
  let messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
      messageDiv.style.opacity = 0;
  }, 5000);
}

// ✅ Sign Up with Email Verification
document.getElementById('submitSignUp').addEventListener('click', async (event) => {
  event.preventDefault();

  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  if (!email || !password || !firstName || !lastName) {
      showMessage("Please fill in all fields.", "signUpMessage");
      return;
  }

  try {
      // 🔹 Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Send Email Verification Link
      await sendEmailVerification(user);
      showMessage("Verification email sent! Please check your inbox.", "signUpMessage");

      // 🔹 Store User Data in Firestore
      await setDoc(doc(db, "users", user.uid), {
          email: email,
          firstName: firstName,
          lastName: lastName,
          isAdmin: false
      });

      // 🔹 Sign Out Immediately (Until Verified)
      await signOut(auth);
      alert("Account Created! Please verify your email before signing in.");
      window.location.href = "login.html";

  } catch (error) {
      console.error("Error:", error);
      showMessage("Error: " + error.message, "signUpMessage");
  }
});

// ✅ Sign In with Email Verification Check
document.getElementById('submitSignIn').addEventListener('click', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
      showMessage("Please enter both email and password.", "signInMessage");
      return;
  }

  try {
      // 🔹 Sign In User
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Check if Email is Verified
      if (!user.emailVerified) {
          showMessage("Please verify your email before logging in.", "signInMessage");
          await signOut(auth);
          return;
      }

      // 🔹 Get User Data from Firestore
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.isAdmin) {
              window.location.href = 'adminDashboard.html';
          } else {
              window.location.href = 'index.html';
          }
      } else {
          showMessage("User data not found.", "signInMessage");
      }

  } catch (error) {
      console.error("Error:", error);
      showMessage("Incorrect Email or Password.", "signInMessage");
  }
});
// ✅ Sign In with Role Checking
document.getElementById("submitSignIn").addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
      alert("Please enter both email and password.");
      return;
  }

  try {
      // 🔹 Sign In User
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Check if Email is Verified
      if (!user.emailVerified) {
          alert("Please verify your email before logging in.");
          await signOut(auth);
          return;
      }

      // 🔹 Fetch User Data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
          const userData = userDoc.data();

          console.log("User Data:", userData); // ✅ Debugging Log

          if (userData.isAdmin === true) {
              console.log("✅ Admin detected, redirecting...");
              window.location.href = "adminDashboard.html";  // ✅ Redirect Admins
          } else {
              console.log("✅ Regular user detected, redirecting...");
              window.location.href = "index.html";  // ✅ Redirect Regular Users
          }
      } else {
          console.error("❌ User data not found in Firestore.");
          alert("User data not found. Contact support.");
      }

  } catch (error) {
      console.error("Error:", error);
      alert("Incorrect Email or Password.");
  }
});