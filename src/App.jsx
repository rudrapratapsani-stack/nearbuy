import { useState, useEffect } from 'react';
import { supabase } from './supabase'; // Aapki supabase file ka path

export default function App() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shops, setShops] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' ya 'signup'

  // Supabase Authentication Check
  useEffect(() => {
    // Current session check karne ke liye
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Auth state badalne par (Login/Logout) track karne ke liye
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Success! Logging in...');
    }
    setLoading(false);
  };

  // Handle Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRole(null); // Reset role on logout
  };

  // -------------------------------------------------------------------------
  // SCREEN 1: Welcome & Login Screen (Agar user logged in NAHI hai)
  // -------------------------------------------------------------------------
  if (!user) {
    return (
      <div style={{
        background: 'linear-gradient(to bottom, #7f92f0, #b27ff0)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
        padding: '20px'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          {/* Logo aur Title */}
          <h1 style={{ color: '#5f73f1', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', margin: '0' }}>
            🛍️ NearBuy
          </h1>
          <p style={{ color: '#666', fontSize: '15px', marginTop: '5px' }}>
            Apne sector ki dukaan, apni bhasha mein
          </p>

          {/* Agar user ne abhi tak koi login option select nahi kiya (image_2.png state) */}
          {!role ? (
            <div style={{ display: 'flex', flexDirection: 'col', gap: '15px', marginTop: '30px', flexDirection: 'column' }}>
              <button
                onClick={() => setRole('customer')}
                style={{ background: '#6c84f5', color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                🛒 Customer Login
              </button>
              <button
                onClick={() => setRole('shopkeeper')}
                style={{ background: '#7e4cb5', color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                🏪 Shop Owner Login
              </button>
              <button
                onClick={() => setRole('admin')}
                style={{ background: '#f28ff2', color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                ⚙️ Admin Login
              </button>
            </div>
          ) : (
            /* Agar button click ho gaya hai, toh form dikhao */
            <form onSubmit={handleLogin} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ textTransform: 'capitalize', color: '#333' }}>{role} Login</h3>

              {message && <p style={{ color: 'red', fontSize: '14px' }}>{message}</p>}

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{ background: '#6c84f5', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                {loading ? 'Checking...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => setRole(null)}
                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
                Go Back
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // SCREEN 2: Dashboard Screen (Sirf tabhi dikhegi jab user Logged In hoga)
  // -------------------------------------------------------------------------
  return (
    <div style={{ fontFamily: 'sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>

      {/* Top Navbar */}
      <div style={{ backgroundColor: '#6c84f5', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px' }}>
          🛍️ NearBuy
        </h2>
        <button
          onClick={handleLogout}
          style={{ backgroundColor: '#9cb0f9', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>

      {/* Main Container */}
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>

        {/* Welcome message */}
        <p style={{ textAlign: 'center', color: '#555', fontWeight: '500' }}>Welcome {user?.email}!</p>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <input
            type="text"
            placeholder="Kya dhundh rahe ho?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontSize: '15px' }}
          />
          <button style={{ backgroundColor: '#6c84f5', color: '#fff', border: 'none', width: '50px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            🔍
          </button>
        </div>

        {/* Nearby Shops List */}
        <h3 style={{ color: '#444', textAlign: 'center', marginBottom: '15px' }}>Nearby Shops:</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          {/* Card 1 */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '16px' }}>Sharma General Store</h4>
            <p style={{ margin: 0, color: '#777', fontSize: '14px' }}>📍 Sector 18 | Grocery</p>
          </div>

          {/* Card 2 */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '16px' }}>Noida Medicos</h4>
            <p style={{ margin: 0, color: '#777', fontSize: '14px' }}>📍 Sector 18 | Medical</p>
          </div>

          {/* Card 3 */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '16px' }}>Fresh Vegetables</h4>
            <p style={{ margin: 0, color: '#777', fontSize: '14px' }}>📍 Sector 62 | Vegetables</p>
          </div>

        </div>

        {/* Coming Soon Note */}
        <p style={{ textAlign: 'center', color: '#f093fb', fontWeight: 'bold', marginTop: '25px' }}>
          ⚡ Coming Soon!
        </p>

      </div>
    </div>
  );
}
