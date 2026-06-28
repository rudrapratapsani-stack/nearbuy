import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [authMode, setAuthMode] = useState('login');

  // Shop Owner Form States
  const [shopName, setShopName] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [shopCategory, setShopCategory] = useState('');
  const [myShop, setMyShop] = useState(null);

  // Item Form States
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [myItems, setMyItems] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserShop(session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserShop(session.user.email);
      } else {
        setMyShop(null);
        setMyItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Shop Owner ki dukan fetch karne ke liye
  const fetchUserShop = async (userEmail) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_email', userEmail);

      if (data && data.length > 0) {
        setMyShop(data[0]);
        fetchShopItems(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Shop ke items fetch karne ke liye
  const fetchShopItems = async (shopId) => {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('shop_id', shopId);
    if (data) setMyItems(data);
  };

  // Sign Up / Login Handle karne ke liye
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (authMode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage('Signup successful! Check your email for confirmation.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    }
    setLoading(false);
  };

  // Nayi Dukan Register karne ke liye
  const handleRegisterShop = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('shops')
      .insert([
        { name: shopName, location: shopLocation, category: shopCategory, owner_email: user.email }
      ])
      .select();

    if (error) {
      alert('Error registering shop: ' + error.message);
    } else {
      alert('Shop Registered Successfully!');
      if (data && data.length > 0) {
        setMyShop(data[0]);
      }
    }
    setLoading(false);
  };

  // Naya Item Add karne ke liye
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!myShop) return;

    const { error } = await supabase
      .from('items')
      .insert([
        { name: itemName, price: parseFloat(itemPrice), shop_id: myShop.id }
      ]);

    if (error) {
      alert('Error adding item: ' + error.message);
    } else {
      alert('Item Added!');
      setItemName('');
      setItemPrice('');
      fetchShopItems(myShop.id);
    }
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    setRole(null);
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial' }}>
        <h2>NearBuy - {authMode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? 'Processing...' : authMode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
        {message && <p style={{ color: 'blue', marginTop: '10px' }}>{message}</p>}
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
            {authMode === 'login' ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    );
  }

  if (!role) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
        <h2>Welcome to NearBuy ({user.email})</h2>
        <p>Aap is app ko kaise use karna chahte hain?</p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setRole('customer')} style={{ padding: '15px 30px', marginRight: '20px', fontSize: '16px', cursor: 'pointer', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}>
            I am a Customer
          </button>
          <button onClick={() => setRole('shop_owner')} style={{ padding: '15px 30px', fontSize: '16px', cursor: 'pointer', background: '#ffc107', color: '#000', border: 'none', borderRadius: '5px' }}>
            I am a Shop Owner
          </button>
        </div>
        <button onClick={handleLogout} style={{ marginTop: '40px', padding: '8px 15px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>
    );
  }

  if (role === 'customer') {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Customer Dashboard</h2>
          <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
        <p>Yahan aaspas ki dukanen aur items dikhenge (Search feature yahan banega).</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h2>Shop Owner Panel</h2>
        <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>

      {loading && <p>Loading shop details...</p>}

      {!loading && !myShop && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3>Register Your Shop</h3>
          <form onSubmit={handleRegisterShop}>
            <div style={{ marginBottom: '10px' }}>
              <label>Shop Name:</label>
              <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Location / Address:</label>
              <input type="text" value={shopLocation} onChange={(e) => setShopLocation(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Category (e.g. Grocery, Cafe, Clothes):</label>
              <input type="text" value={shopCategory} onChange={(e) => setShopCategory(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Register Shop</button>
          </form>
        </div>
      )}

      {!loading && myShop && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ background: '#e2e3e5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>🏪 {myShop.name}</h3>
            <p><strong>📍 Location:</strong> {myShop.location} | <strong>📦 Category:</strong> {myShop.category}</p>
          </div>

          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
            <h4>Add New Product / Item</h4>
            <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ flex: 2 }}>
                <label style={{ fontSize: '12px' }}>Item Name:</label>
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="e.g. Milk" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px' }}>Price (₹):</label>
                <input type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="e.g. 60" />
              </div>
              <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', height: '36px' }}>Add</button>
            </form>
          </div>

          <div>
            <h4>Your Product List ({myItems.length})</h4>
            {myItems.length === 0 ? (
              <p style={{ color: 'gray' }}>Abhi tak koi item add nahi kiya hai.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {myItems.map((item) => (
                  <li key={item.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.name}</span>
                    <strong>₹{item.price}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
