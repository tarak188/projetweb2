import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import UserProducts from './userprod';
import pannier from './pictures/cart.png';
import logo from './pictures/TunisiaTech.png';
import './newhome.scss';
import { 
  Palette, 
  CircleArrowOutDownLeft,
  CircleFadingPlus,
  Heart, 
  ShoppingCart,
  ChevronUp,
  Codepen 
} from 'lucide-react';
import AdminD from './adminDash';
import en from './eng.json';
import fr from './fr.json';
import LangSwitcher from './LangSwitcher';

const Home1 = () => {
  const [isNavToggled, setIsNavToggled] = useState(false);
  const [isFooterToggled, setIsFooterToggled] = useState(false);
  const [userName, setUserName] = useState('User');
  const [photoURL, setPhotoURL] = useState(null);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [language, setLanguage] = useState('en'); // Default language is English
  const langData = language === 'en' ? en : fr;

  // Function to handle language change
  const handleLanguageChange = (e) => {
    setLanguage(e.target.checked ? 'fr' : 'en');
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || user.email.split('@')[0]);
      setPhotoURL(user.photoURL);
    } else {
      navigate('/login'); // Redirect to login if no user is authenticated
    }
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await user.sendEmailVerification();
        console.log('Verification email sent');
      } else {
        console.error('No user is currently signed in');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };

  return (
    <div className='newhome'>
      {!auth.currentUser?.emailVerified ? (
        <div>
          <h1>Please verify your account</h1>
          <button onClick={handleResendVerification}>Resend Verification Email</button>
        </div>
      ) : (
        <div className='myHome'>
          <div id="nav-bar">
            <input 
              type="checkbox" 
              id="nav-toggle" 
              checked={isNavToggled}
              onChange={e => setIsNavToggled(e.target.checked)}
            />
            <div id="nav-header">
              <a id="nav-title" href="https://codepen.io" target="_blank" rel="noopener noreferrer">
                <img src={logo} className='Logo'/>
              </a>
              <label htmlFor="nav-toggle">
                <span id="nav-toggle-burger"></span>
              </label>
              <hr />
            </div>

            {auth.currentUser?.email !== "tarakbelhiba3@gmail.com" && (
              <div id="nav-content">
                <div className="nav-button">
                  <CircleFadingPlus className="w-5 h-5" style={{marginRight:"10px"}}/>
                  <span> <Link to="/productajout">{langData.addprod}</Link> </span>
                </div>

                <div className="nav-button">
                  <ShoppingCart className="w-5 h-5" style={{marginRight:"10px"}}/>
                  <span> <Link to="/produits">{langData.buyprod}</Link></span>
                </div>
                <hr />
                <div className="nav-button">
                  <Heart className="w-5 h-5" style={{marginRight:"10px"}}/>
                  <span><Link to="/pannier">{langData.whishlist}</Link></span>
                </div>

                <div id="nav-content-highlight"></div>
              </div>
            )}

            <input 
              type="checkbox" 
              id="nav-footer-toggle"
              checked={isFooterToggled}
              onChange={e => setIsFooterToggled(e.target.checked)}
            />

            <div id="nav-footer">
              <div id="nav-footer-heading">
                <div id="nav-footer-avatar">
                  {photoURL && (
                    <img
                      src={photoURL}
                      alt="Profile"            
                    />
                  )}
                </div>
                <div id="nav-footer-titlebox">
                  <a 
                    id="nav-footer-title" 
                    href="https://codepen.io/uahnbu/pens/public" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {userName}
                  </a>
                  <span id="nav-footer-subtitle">{user.email === "tarakbelhiba3@gmail.com" ? <p>Admin</p> : <p>User</p>}</span>
                </div>
                <label htmlFor="nav-footer-toggle">
                  <ChevronUp className="w-5 h-5" />
                </label>
              </div>
              <div id="nav-footer-content">
                <button onClick={handleLogout}><CircleArrowOutDownLeft />{langData.disconnect}</button>
              </div>
            </div>
          </div>

          <div className="content">
            <LangSwitcher onLanguageChange={handleLanguageChange} />
            <h1>{langData.welcome}, <span style={{color:"blue"}}>{userName}!</span></h1>
            {auth.currentUser?.email === "tarakbelhiba3@gmail.com" ? <AdminD language={language} /> : <UserProducts language={language} />}
            </div>

        </div>
      )}
    </div>
  );
};

export default Home1;
