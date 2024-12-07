import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth, storage, db } from './firebase'; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';
import userImage from './pictures/user.png';
import "./SignUp.scss";
import en from './eng.json';
import fr from './fr.json';
import LangSwitcher from './LangSwitcher';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerif, setPasswordVerif] = useState('');
  const [name, setName] = useState('');
  const [picture, setPicture] = useState(null);
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en'); 

  const langData = language === 'en' ? en : fr;

  const handleLanguageChange = (e) => {
    setLanguage(e.target.checked ? 'fr' : 'en');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let p = document.getElementById('passV');
  
    if (password !== passwordVerif) {
      p.innerHTML = "Passwords do not match!";
      return;
    }
    p.innerHTML = "";
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const registeredUser = userCredential.user;
  
      await sendEmailVerification(registeredUser);
  
      let photoURL = null; 
  
      const storageRef = ref(storage, `profilePictures/${registeredUser.uid}`);
      if (picture) {
        await uploadBytes(storageRef, picture); 
      } else {
        const response = await fetch(userImage);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
      }
  
      photoURL = await getDownloadURL(storageRef);
  
      await updateProfile(registeredUser, {
        displayName: name,
        photoURL: photoURL,
      });
  
      const userRef = doc(db, 'userIds', registeredUser.uid);
      await setDoc(userRef, { id: true, isLoggedIn: false });
  
      console.log("User Registered successfully!");
      navigate('/login');
  
    } catch (error) {
      console.error("Error:", error.message);
      p.innerHTML = error.message;
    }
  };
  

  return (
    <div className="register">
      <div className="col-md-12">
        <LangSwitcher onLanguageChange={handleLanguageChange}/>
        <form onSubmit={handleRegister}>
          <h1>Sign Up</h1>

          <fieldset>
            <label htmlFor="name">{langData.signup}</label>
            <input
              type="text"
              id="name"
              name="user_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label id='nameV'></label>

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="mail"
              name="user_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label id='mailV'></label>

            <label htmlFor="password">{langData.password}</label>
            <input
              type="password"
              id="password"
              name="user_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="passwordverif">{langData.passwordverif}</label>
            <input
              type="password"
              id="passwordverif"
              name="user_password_verif"
              value={passwordVerif}
              onChange={(e) => setPasswordVerif(e.target.value)}
            />
            <label id='passV'></label>

            <label htmlFor="picture">{langData.picture}</label>
            <input
              type="file"
              id="picture"
              name="user_picture"
              onChange={(e) => setPicture(e.target.files[0])}
            />
          </fieldset>

          <button type="submit">{langData.signup}</button>
          <Link to="/login">{langData.accountexist}</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
