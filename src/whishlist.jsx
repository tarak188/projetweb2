import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Link, Navigate, useNavigate} from 'react-router-dom';
import Popup from 'reactjs-popup';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const wishlistRef = collection(db, `users/${user.uid}/wishlist`);
      const querySnapshot = await getDocs(wishlistRef);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWishlistItems(items);

      const initialQuantities = {};
      items.forEach(item => {
        initialQuantities[item.id] = item.quantity || 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const itemRef = doc(db, `users/${user.uid}/wishlist`, itemId);
      await updateDoc(itemRef, {
        quantity: newQuantity
      });

      setQuantities(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    }
  };

  const removeFromWishlist = async (itemId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const itemRef = doc(db, `users/${user.uid}/wishlist`, itemId);
      await deleteDoc(itemRef);
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      alert("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  if (!auth.currentUser) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
        <p>Please log in to view your wishlist.</p>
        <Link to="/login" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
        <div className="fetch">
          Loading your wishlist...
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      <Link to="/home" className="text-blue-500 hover:underline mb-4 block">
        Back Home
      </Link>
      
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid gap-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg">
              <div className="flex items-start gap-4">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="font-medium">Price: ${item.price}</p>
                  
                  <div className="mt-2 flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      value={quantities[item.id] || 1}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="w-20 p-1 border rounded"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      style={{backgroundColor:"red"}}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Popup
            trigger={<button style={{backgroundColor:"blue",cursor:"pointer",width:"50%",marginLeft:"380px"}}>Choose payment method</button>}
            position="right center"
            modal
          >
            <div style={{backgroundColor:"blue",padding:"40px",borderRadius:"20px"}}>
              <button className="px-3 py-1 bg-gray-300 m-2 rounded">Mastercard</button>
              <button 
            className="px-3 py-1 bg-gray-300 m-2 rounded" 
            onClick={() => navigate("/credit")}
        >
            Credit Card
        </button>            </div>
          </Popup>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
