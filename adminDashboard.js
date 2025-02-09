import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";

import { 
    getAuth, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

import { 
    getFirestore, doc, getDoc, collection, getDocs, deleteDoc 
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

// ✅ Check if User is Admin
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Access Denied! Redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists() || !userDoc.data().isAdmin) {
        alert("You are not authorized to access this page.");
        window.location.href = "index.html"; // Redirect non-admin users
        return;
    }

    console.log("Admin Verified! Loading Dashboard...");

    // ✅ Fetch Users from Firestore
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // ✅ Display Users in Table
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = "";

    usersList.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.firstName || "N/A"} ${user.lastName || ""}</td>
            <td>${user.email}</td>
            <td><button class="delete-btn" data-id="${user.id}">Delete</button></td>
        `;
        userTable.appendChild(row);
    });

    // ✅ Delete User Function
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async (event) => {
            const userId = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this user?")) {
                await deleteDoc(doc(db, "users", userId));
                alert("User deleted successfully!");
                window.location.reload();
            }
        });
    });
});

// ✅ Logout Function
document.getElementById("logout").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
});
