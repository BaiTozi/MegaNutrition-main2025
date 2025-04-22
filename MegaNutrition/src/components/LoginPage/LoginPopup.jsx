import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { auth, db } from "../../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Sign Up");
  const [email, setEmail] = useState("abc@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [name, setName] = useState("");
  const [secretCode, setSecretCode] = useState("");

  async function login() {
    console.log(currState);

    if (currState === "Login") {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName || "Unknown",
            email: user.email,
            role: "user",
            createdAt: new Date(),
          });
          // Then re-fetch it if needed
        }
        const userRole = userDoc.data().role;

        console.log(userDoc)

       if (userRole === "admin") {
           window.location.href = "/admin"; // Redirect to admin panel
         } else {
         window.location.href = "/"; // Redirect to home page
       }

        setShowLogin(false); // Close popup after login
      } catch (error) {
        console.error("Login Error:", error);
      }
    } else if (currState === "Sign Up") {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Determine role based on secret code
        const role = secretCode === "ADMIN_SECRET_CODE" ? "admin" : "user";

        // Save user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          role: role, // Set role based on secret code
          createdAt: new Date(), // Add registration date
        });

        console.log("User registered:", user);
        setShowLogin(false); // Close popup after signup
      } catch (error) {
        console.error("Error registering user:", error);
      }
    }
  }

  return (
    <div className="login-popup">
      <div className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <>
              <input
                type="text"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Admin Secret Code (optional)"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={login}>{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;