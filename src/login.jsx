import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import en from './eng.json';
import fr from './fr.json';
import LangSwitcher from './LangSwitcher';
import './login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');

  const langData = language === 'en' ? en : fr;

  const handleLanguageChange = (e) => {
    setLanguage(e.target.checked ? 'fr' : 'en');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User logged in successfully!', user);

      const userRef = doc(db, 'userIds', user.uid);
      await setDoc(userRef, { isLoggedIn: true }, { merge: true });

      const userName = user.displayName || user.email.split('@')[0];

      navigate('/home', {
        state: { userName, photoURL: user.photoURL || '' },
      });
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError(langData.loginError.replace('{{error}}', error.message));
    }
  };

  return (
    <div className="login-container">
      {/* Integrate LangSwitcher component */}
      <LangSwitcher onLanguageChange={handleLanguageChange} />

      <form onSubmit={handleLogin}>
        <h1>{langData.login}</h1>
        {error && <p className="error">{error}</p>}

        <fieldset>
          <label htmlFor="email">{langData.email}:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={langData.emailPlaceholder}
            required
          />

          <label htmlFor="password">{langData.password}:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={langData.passwordPlaceholder}
            required
          />
        </fieldset>

        <button type="submit">{langData.login}</button>
        <Link to="/signup">{langData.goToRegister}</Link>
      </form>
    </div>
  );
};

export default Login;
