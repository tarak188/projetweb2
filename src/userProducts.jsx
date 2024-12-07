import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Link } from 'react-router-dom';
import './allproducts.css';

const UserProducts = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [wishlistnb, setWishlistNb] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchUserProducts = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to view your products.");
        return;
      }

      try {
        const userId = user.uid;
        const q = query(collection(db, 'products'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error("Error fetching user products:", error);
      }
    };

    fetchUserProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const addToWishlist = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add items to your wishlist.");
      return;
    }

    try {
      const quantity = quantities[product.id] || 1;
      const filteredProduct = {
        ...Object.fromEntries(Object.entries(product).filter(([_, value]) => value !== undefined)),
        quantity,
      };

      const wishlistRef = doc(db, `users/${user.uid}/wishlist`, product.id);
      await setDoc(wishlistRef, filteredProduct);

      setWishlistNb((prevCount) => prevCount + quantity);

      alert(`${product.title} (Quantity: ${quantity}) has been added to your wishlist!`);
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      alert("Failed to add to wishlist.");
    }
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredProducts(userProducts);
    } else {
      const filtered = userProducts.filter((product) => product.category === category);
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Products</h1>
      <Link to="/home" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">Back Home</Link>
      
      {/* Category Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => filterByCategory('all')}
        >
          All Products
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedCategory === 'ordinateur' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => filterByCategory('ordinateur')}
        >
          Ordinateur
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedCategory === 'smartphone' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => filterByCategory('smartphone')}
        >
          Smartphone
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedCategory === 'perepherique' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => filterByCategory('perepherique')}
        >
          Pérepherique
        </button>
      </div>

      <h2 className="text-lg mb-4">Wishlist Count: {wishlistnb}</h2>

      {filteredProducts.length === 0 ? (
        <div className="fetch">
          {userProducts.length === 0 ? (
            <>
              Fetching items...
              <div className="loader"></div>
            </>
          ) : (
            'No products found in this category'
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-gray-800 font-medium">Price: {product.price}</p>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-32 h-32 object-cover my-2"
                />
              )}
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-20"
                  max={product.quantity}
                  placeholder="Qty"
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                />
                <button
                  onClick={() => addToWishlist(product)}
                  className="btn btn-success"
                >
                  Ajouter à mon pannier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProducts;
