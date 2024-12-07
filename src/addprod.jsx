import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db, auth } from './firebase';
import { Link } from 'react-router-dom';
import './addprodct.scss';
import en from './eng.json';
import fr from './fr.json';
import LangSwitcher from './LangSwitcher';

const AddProd = () => {
  const [prod, setProd] = useState({
    category: '',
    title: '',
    description: '',
    image: null,
    price: '',
    quantity: '',
  });

  const [language, setLanguage] = useState('en'); 
  const langData = language === 'en' ? en : fr;


  const handleLanguageChange = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'fr' : 'en')); 
  };

  const handleAjout = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You need to be logged in to add a product.');
        return;
      }

      const { category, title, description, image, price, quantity } = prod;

      if (!image) {
        alert('Please upload an image.');
        return;
      }

      const imageRef = ref(storage, `products/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, 'products'), {
        userId: user.uid,
        category,
        title,
        description,
        imageUrl,
        price,
        quantity,
      });

      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product.');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setProd({ ...prod, image: files[0] });
    } else {
      setProd({ ...prod, [name]: value });
    }
  };

  return (
    <div className="add-product-container">
      <form className="add-product-form" onSubmit={handleAjout}>
        <LangSwitcher onLanguageChange={handleLanguageChange} />
        <h1>{langData.AddProd}</h1>
        <Link className="back-link" to="/home">
          {langData.backhome}
        </Link>

        <div className="form-group">
          <label>{langData.Category}</label>
          <div className="radio-group">
            <input
              type="radio"
              id="ordinateur"
              name="category"
              value="ordinateur"
              onChange={handleChange}
            />
            <label htmlFor="ordinateur">{langData.computer}</label>
            <input
              type="radio"
              id="smartphone"
              name="category"
              value="smartphone"
              onChange={handleChange}
            />
            <label htmlFor="smartphone">{langData.phones}</label>
            <input
              type="radio"
              id="perephirique"
              name="category"
              value="perepherique"
              onChange={handleChange}
            />
            <label htmlFor="perepherique">{langData.hardwares}</label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">{langData.prodname}</label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">{langData.proddesc}</label>
          <textarea
            id="description"
            name="description"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="prodPic">{langData.prodimage}</label>
          <input
            type="file"
            id="prodPic"
            name="image"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">{langData.prodprice}</label>
          <input
            type="text"
            id="price"
            name="price"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">{langData.prodquantity}</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            onChange={handleChange}
            defaultValue={1}
            min={1}
          />
        </div>

        <button type="submit" className="submit-button">
          {langData.btnaddprod}
        </button>
      </form>
    </div>
  );
};

export default AddProd;
