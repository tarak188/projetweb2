import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import './userprods.scss';
import en from './eng.json';
import fr from './fr.json';
import LangSwitcher from './LangSwitcher';

const UserProducts = ({ language }) => {
  const [userProducts, setUserProducts] = useState([]);
  
  const langData = language === 'en' ? en : fr;

  useEffect(() => {
    const fetchUserProducts = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert('You need to be logged in to see your products.');
        return;
      }

      const q = query(collection(db, 'products'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserProducts(products);
    };

    fetchUserProducts();
  }, []);

  return (
    <div className="user-products">
      <h1>{langData.products}</h1>
      {userProducts.length > 0 ? (
        <div className="products-grid">
          {userProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.imageUrl} alt={product.title} className="product-image" />
              <h2 className="product-title">{product.title}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">{langData.priceprod}${product.price}</p>
              <p className="product-quantity">{langData.prodquantity}{product.quantity}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>{langData.noproducts}</p>
      )}
    </div>
  );
};

export default UserProducts;
