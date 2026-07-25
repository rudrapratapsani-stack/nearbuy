import { useState, useEffect } from 'react';
import { supabase } from './supabase';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = {
  bg: '#0f0f0f',
  surface: '#1a1a1a',
  card: '#222222',
  orange: '#FF6B2C',
  orangeHover: '#e85a1e',
  orangeLight: '#ff8c5a',
  text: '#f0f0f0',
  muted: '#888888',
  border: '#2e2e2e',
  white: '#ffffff',
};

const fonts = {
  display: "'Syne', sans-serif",
  body: "'DM Sans', sans-serif",
};

const googleFontsLink = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: ${C.bg}; color: ${C.text}; font-family: ${fonts.body}; }

.nb-btn {
background: ${C.orange};
color: #fff;
border: none;
border-radius: 10px;
padding: 14px 20px;
font-size: 15px;
font-weight: 600;
cursor: pointer;
width: 100%;
transition: background 0.2s;
font-family: ${fonts.body};
}
.nb-btn:hover { background: ${C.orangeHover}; }
.nb-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.nb-btn-ghost {
background: transparent;
color: ${C.muted};
border: none;
cursor: pointer;
font-size: 14px;
text-decoration: underline;
font-family: ${fonts.body};
padding: 4px 0;
}

.nb-input {
background: ${C.card};
border: 1px solid ${C.border};
border-radius: 10px;
padding: 13px 16px;
color: ${C.text};
font-size: 15px;
width: 100%;
outline: none;
font-family: ${fonts.body};
transition: border-color 0.2s;
}
.nb-input:focus { border-color: ${C.orange}; }
.nb-input::placeholder { color: ${C.muted}; }

.nb-card {
background: ${C.card};
border: 1px solid ${C.border};
border-radius: 14px;
padding: 18px 20px;
transition: border-color 0.2s;
}
.nb-card:hover { border-color: ${C.orange}; }

.badge {
display: inline-block;
background: ${C.orange}22;
color: ${C.orangeLight};
border-radius: 6px;
padding: 3px 10px;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.04em;
}
`;

// Inject styles once
if (!document.getElementById('nb-styles')) {
  const style = document.createElement('style');
  style.id = 'nb-styles';
  style.textContent = googleFontsLink;
  document.head.appendChild(style);
}

// ─── Role Selection Screen ────────────────────────────────────────────────────
function RoleScreen({ onSelect }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          width: 64, height: 64,
          background: C.orange,
          borderRadius: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, margin: '0 auto 16px',
        }}>🛍️</div>
        <h1 style={{ fontFamily: fonts.display, fontSize: 32, fontWeight: 800, color: C.white }}>
          NearBuy
        </h1>
        <p style={{ color: C.muted, marginTop: 6, fontSize: 15 }}>
          Apne sector ki dukaan, apni bhasha mein
        </p>
      </div>

      {/* Role buttons */}
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { role: 'customer', label: '🛒 Customer', sub: 'Shops dhundho aur items khojo' },
          { role: 'shopkeeper', label: '🏪 Shop Owner', sub: 'Apni dukaan manage karo' },
          { role: 'admin', label: '⚙️ Admin', sub: 'Platform manage karo' },
        ].map(({ role, label, sub }) => (
          <button
            key={role}
            onClick={() => onSelect(role)}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: '18px 20px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.2s, background 0.2s',
              color: C.text,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = C.orange;
              e.currentTarget.style.background = C.card;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.background = C.surface;
            }}
          >
            <div style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 700 }}>{label}</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Auth Screen (Login / Signup) ─────────────────────────────────────────────
function AuthScreen({ role, onBack }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const roleLabels = { customer: '🛒 Customer', shopkeeper: '🏪 Shop Owner', admin: '⚙️ Admin' };

  const handleAuth = async () => {
    setLoading(true);
    setMessage('');
    setIsError(false);

    let result;
    if (mode === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) {
      setMessage(result.error.message);
      setIsError(true);
    } else if (mode === 'signup') {
      setMessage('Account ban gaya! Ab login karo.');
      setMode('login');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: 380,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: '32px 28px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🛍️</div>
          <h2 style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 800, color: C.white }}>
            NearBuy
          </h2>
          <span className="badge" style={{ marginTop: 8 }}>{roleLabels[role]}</span>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: C.card,
          borderRadius: 10,
          padding: 4,
          marginBottom: 24,
          gap: 4,
        }}>
          {['login', 'signup'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setMessage(''); }}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: fonts.body,
                background: mode === m ? C.orange : 'transparent',
                color: mode === m ? C.white : C.muted,
                transition: 'all 0.2s',
              }}
            >
              {m === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div style={{
            background: isError ? '#ff3b3b22' : '#22c55e22',
            color: isError ? '#ff6b6b' : '#4ade80',
            border: `1px solid ${isError ? '#ff3b3b44' : '#22c55e44'}`,
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            marginBottom: 16,
          }}>
            {message}
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            className="nb-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="nb-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
          />
          <button className="nb-btn" onClick={handleAuth} disabled={loading} style={{ marginTop: 4 }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login karo' : 'Account banao'}
          </button>
        </div>

        {/* Back */}
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <button className="nb-btn-ghost" onClick={onBack}>
            ← Wapas jao
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Customer Dashboard ───────────────────────────────────────────────────────
function CustomerDashboard({ user, onLogout }) {
  const [search, setSearch] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchShops();
  }, [search]);

  const fetchShops = async () => {
    setLoading(true);
    let query = supabase.from('shops').select('*');
    if (search) {
      query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%,location.ilike.%${search}%`);
    }
    const { data, error } = await query;
    if (!error) setShops(data);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: fonts.body }}>
      {/* Navbar */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: 800, color: C.white }}>
          🛍️ NearBuy
        </div>
        <button
          onClick={onLogout}
          style={{
            background: 'transparent',
            border: `1px solid ${C.border}`,
            color: C.muted,
            borderRadius: 8,
            padding: '7px 14px',
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: fonts.body,
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ padding: '20px', maxWidth: 500, margin: '0 auto' }}>
        {/* Greeting */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 800, color: C.white }}>
            Kya dhundh rahe ho? 🔍
          </h2>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{user?.email}</p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <input
            className="nb-input"
            type="text"
            placeholder="Shop ya item type karo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingRight: 48 }}
          />
          <span style={{
            position: 'absolute', right: 14, top: '50%',
            transform: 'translateY(-50%)', fontSize: 18,
          }}>🔍</span>
        </div>

        {/* Shop cards */}
        <div style={{ marginBottom: 12 }}>
          <span style={{ color: C.muted, fontSize: 13 }}>
            {shops.length} shops mile • Sector 18 ke aas paas
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shops.map(shop => (
            <div key={shop.id} className="nb-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48,
                  background: C.orange + '22',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                }}>
                  {shop.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: C.white }}>{shop.name}</div>
                  <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>📍 {shop.location}</div>
                </div>
                <span className="badge">{shop.category}</span>
              </div>
            </div>
          ))}

          {shops.length === 0 && (
            <div style={{ textAlign: 'center', color: C.muted, padding: '40px 0', fontSize: 15 }}>
              😔 Koi shop nahi mili<br />
              <span style={{ fontSize: 13 }}>Dusra naam try karo</span>
            </div>
          )}
        </div>

        <div style={{
          textAlign: 'center',
          color: C.orange,
          fontWeight: 600,
          marginTop: 30,
          fontSize: 13,
          padding: '16px',
          background: C.orange + '11',
          borderRadius: 10,
          border: `1px solid ${C.orange}33`,
        }}>
          ⚡ Real-time search aur GPS — Coming Soon!
        </div>
      </div>
    </div>
  );
}
// ─── Admin Dashboard ────────────────────────────────────────────────────────
function AdminDashboard({ user, onLogout }) {
  const [allShops, setAllShops] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [tab, setTab] = useState('shops');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllShops();
  }, []);

  const fetchAllShops = async () => {
    setLoading(true);
    const { data } = await supabase.from('shops').select('*');
    if (data) setAllShops(data);
    setLoading(false);
  };

  const handleDeleteShop = async (id) => {
    await supabase.from('shops').delete().eq('id', id);
    fetchAllShops();
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: fonts.body }}>
      {/* Navbar */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: 800, color: C.white }}>
          🛍️ NearBuy Admin
        </div>
        <button onClick={onLogout} style={{
          background: 'transparent',
          border: `1px solid ${C.border}`,
          color: C.muted,
          borderRadius: 8,
          padding: '7px 14px',
          cursor: 'pointer',
          fontSize: 13,
          fontFamily: fonts.body,
        }}>Logout</button>
      </div>

      <div style={{ padding: '20px', maxWidth: 500, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 800, color: C.white }}>
            ⚙️ Admin Panel
          </h2>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{user?.email}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{
            flex: 1, background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12, padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 800, color: C.orange }}>
              {allShops.length}
            </div>
            <div style={{ color: C.muted, fontSize: 13 }}>Total Shops</div>
          </div>
          <div style={{
            flex: 1, background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12, padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 800, color: C.orange }}>
              {[...new Set(allShops.map(s => s.owner_email))].length}
            </div>
            <div style={{ color: C.muted, fontSize: 13 }}>Shop Owners</div>
          </div>
        </div>

        {/* All Shops */}
        <h3 style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 14 }}>
          Saari Shops ({allShops.length})
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: '30px 0' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {allShops.map(shop => (
              <div key={shop.id} className="nb-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: C.white }}>{shop.name}</div>
                    <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>📍 {shop.location}</div>
                    <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>👤 {shop.owner_email}</div>
                    <span className="badge" style={{ marginTop: 6 }}>{shop.category}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteShop(shop.id)}
                    style={{
                      background: '#ff3b3b22',
                      color: '#ff6b6b',
                      border: '1px solid #ff3b3b44',
                      borderRadius: 8,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontFamily: fonts.body,
                      flexShrink: 0,
                    }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// ─── Shop Owner Dashboard ────────────────────────────────────────────────────
function ShopOwnerDashboard({ user, onLogout }) {
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [myShops, setMyShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [selectedShopId, setSelectedShopId] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [myShopItems, setMyShopItems] = useState([]);
  const [itemPrices, setItemPrices] = useState({});
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => {
    fetchMyShops();
  }, []);

  const fetchMyShops = async () => {
    const { data } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_email', user.email);
    if (data) setMyShops(data);
  };

  const handleAddShop = async () => {
    if (!shopName || !location || !category) {
      setMessage('Saari fields bharo!');
      setIsError(true);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('shops').insert([{
      name: shopName,
      location: location,
      category: category,
      owner_email: user.email,
    }]);
    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else {
      setMessage('Shop add ho gayi! 🎉');
      setIsError(false);
      setShopName('');
      setLocation('');
      setCategory('');
      fetchMyShops();
    }
    setLoading(false);
  };

  const handleDeleteShop = async (id) => {
    await supabase.from('shops').delete().eq('id', id);
    if (selectedShopId === id) setSelectedShopId(null);
    fetchMyShops();
  };

  const openItemsFor = async (shopId) => {
    setSelectedShopId(shopId);
    setItemsLoading(true);

    const { data: itemsData } = await supabase
      .from('Items')
      .select('*')
      .eq('status', 'approved');

    const { data: shopItemsData } = await supabase
      .from('shop_items')
      .select('*')
      .eq('shop_id', shopId);

    if (itemsData) setAllItems(itemsData);

    const priceMap = {};
    if (shopItemsData) {
      shopItemsData.forEach(si => {
        priceMap[si.item_id] = si.price?.toString() ?? '';
      });
      setMyShopItems(shopItemsData);
    }
    setItemPrices(priceMap);
    setItemsLoading(false);
  };

  const closeItemsPanel = () => {
    setSelectedShopId(null);
    setAllItems([]);
    setMyShopItems([]);
    setItemPrices({});
  };

  const isItemAdded = (itemId) => myShopItems.some(si => si.item_id === itemId);

  const handlePriceChange = (itemId, value) => {
    setItemPrices(prev => ({ ...prev, [itemId]: value }));
  };

  const handleAddItem = async (item) => {
    const priceVal = itemPrices[item.id];
    if (!priceVal || isNaN(priceVal) || Number(priceVal) <= 0) {
      setMessage('Sahi price daalo ' + item.Name + ' ke liye');
      setIsError(true);
      return;
    }
    const { error } = await supabase.from('shop_items').insert([{
      shop_id: selectedShopId,
      item_id: item.id,
      price: Number(priceVal),
    }]);
    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else {
      setMessage(item.Name + ' add ho gaya! 🎉');
      setIsError(false);
      openItemsFor(selectedShopId);
    }
  };

  const handleUpdateItemPrice = async (item) => {
    const priceVal = itemPrices[item.id];
    if (!priceVal || isNaN(priceVal) || Number(priceVal) <= 0) {
      setMessage('Sahi price daalo ' + item.Name + ' ke liye');
      setIsError(true);
      return;
    }
    const existing = myShopItems.find(si => si.item_id === item.id);
    if (!existing) return;
    const { error } = await supabase
      .from('shop_items')
      .update({ price: Number(priceVal) })
      .eq('id', existing.id);
    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else {
      setMessage('Price update ho gaya! ✅');
      setIsError(false);
      openItemsFor(selectedShopId);
    }
  };

  const handleRemoveItem = async (item) => {
    const existing = myShopItems.find(si => si.item_id === item.id);
    if (!existing) return;
    await supabase.from('shop_items').delete().eq('id', existing.id);
    openItemsFor(selectedShopId);
  };

  const groupedItems = allItems.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: fonts.body }}>
      {/* Navbar */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: 800, color: C.white }}>
          🛍️ NearBuy
        </div>
        <button onClick={onLogout} style={{
          background: 'transparent',
          border: `1px solid ${C.border}`,
          color: C.muted,
          borderRadius: 8,
          padding: '7px 14px',
          cursor: 'pointer',
          fontSize: 13,
          fontFamily: fonts.body,
        }}>Logout</button>
      </div>

      <div style={{ padding: '20px', maxWidth: 500, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 800, color: C.white }}>
            🏪 Apni Shop Add Karo
          </h2>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{user?.email}</p>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            background: isError ? '#ff3b3b22' : '#22c55e22',
            color: isError ? '#ff6b6b' : '#4ade80',
            border: `1px solid ${isError ? '#ff3b3b44' : '#22c55e44'}`,
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            marginBottom: 16,
          }}>{message}</div>
        )}

        {/* Form */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: '20px',
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <input className="nb-input" placeholder="Shop ka naam" value={shopName} onChange={e => setShopName(e.target.value)} />
          <input className="nb-input" placeholder="Location (jaise Sector 18, Noida)" value={location} onChange={e => setLocation(e.target.value)} />
          <input className="nb-input" placeholder="Category (jaise Grocery, Medical)" value={category} onChange={e => setCategory(e.target.value)} />
          <button className="nb-btn" onClick={handleAddShop} disabled={loading}>
            {loading ? 'Adding...' : '+ Shop Add Karo'}
          </button>
        </div>

        {/* My Shops */}
        <h3 style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 14 }}>
          Meri Shops ({myShops.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {myShops.length === 0 ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: '30px 0' }}>
              Abhi koi shop nahi hai — upar se add karo! 🏪
            </div>
          ) : (
            myShops.map(shop => (
              <div key={shop.id} className="nb-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: C.white }}>{shop.name}</div>
                    <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>📍 {shop.location}</div>
                    <span className="badge" style={{ marginTop: 6 }}>{shop.category}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteShop(shop.id)}
                    style={{
                      background: '#ff3b3b22',
                      color: '#ff6b6b',
                      border: '1px solid #ff3b3b44',
                      borderRadius: 8,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontFamily: fonts.body,
                    }}>
                    🗑️ Delete
                  </button>
                </div>
                <button
                  className="nb-btn"
                  onClick={() => selectedShopId === shop.id ? closeItemsPanel() : openItemsFor(shop.id)}
                  style={{ marginTop: 14, background: selectedShopId === shop.id ? C.card : C.orange, border: selectedShopId === shop.id ? `1px solid ${C.border}` : 'none', color: selectedShopId === shop.id ? C.text : '#fff' }}
                >
                  {selectedShopId === shop.id ? '✕ Band Karo' : '📦 Items Manage Karo'}
                </button>

                {selectedShopId === shop.id && (
                  <div style={{ marginTop: 18, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                    {itemsLoading ? (
                      <div style={{ textAlign: 'center', color: C.muted, padding: '20px 0' }}>Loading items...</div>
                    ) : (
                      <>
                        <div style={{ marginBottom: 22 }}>
                          <div style={{
                            fontFamily: fonts.display,
                            fontSize: 15,
                            fontWeight: 700,
                            color: C.white,
                            marginBottom: 10,
                          }}>
                            🧾 Meri Items ({myShopItems.length})
                          </div>
                          {myShopItems.length === 0 ? (
                            <div style={{ color: C.muted, fontSize: 13, padding: '10px 0' }}>
                              Abhi koi item add nahi kiya — niche list se add karo 👇
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {myShopItems.map(si => {
                                const itemInfo = allItems.find(i => i.id === si.item_id);
                                if (!itemInfo) return null;
                                return (
                                  <div key={si.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    background: C.orange + '11',
                                    borderRadius: 10,
                                    padding: '10px 12px',
                                    border: `1px solid ${C.orange}44`,
                                  }}>
                                    <div style={{ flex: 1, fontSize: 14, color: C.white, fontWeight: 600 }}>
                                      {itemInfo.Name}
                                      <span className="badge" style={{ marginLeft: 8 }}>{itemInfo.category}</span>
                                    </div>
                                    <input
                                      type="number"
                                      value={itemPrices[si.item_id] ?? ''}
                                      onChange={e => handlePriceChange(si.item_id, e.target.value)}
                                      style={{
                                        width: 80,
                                        background: C.surface,
                                        border: `1px solid ${C.border}`,
                                        borderRadius: 8,
                                        padding: '7px 10px',
                                        color: C.text,
                                        fontSize: 13,
                                        outline: 'none',
                                      }}
                                    />
                                    <button
                                      onClick={() => handleUpdateItemPrice(itemInfo)}
                                      style={{
                                        background: C.orange, color: '#fff', border: 'none',
                                        borderRadius: 8, padding: '7px 10px', fontSize: 12,
                                        cursor: 'pointer', fontFamily: fonts.body,
                                      }}
                                    >
                                      Update
                                    </button>
                                    <button
                                      onClick={() => handleRemoveItem(itemInfo)}
                                      style={{
                                        background: '#ff3b3b22', color: '#ff6b6b',
                                        border: '1px solid #ff3b3b44', borderRadius: 8,
                                        padding: '7px 10px', fontSize: 12, cursor: 'pointer',
                                        fontFamily: fonts.body,
                                      }}
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div style={{
                          fontFamily: fonts.display,
                          fontSize: 15,
                          fontWeight: 700,
                          color: C.white,
                          marginBottom: 10,
                          borderTop: `1px solid ${C.border}`,
                          paddingTop: 16,
                        }}>
                          + Naya Item Add Karo
                        </div>
                      </>
                    )}
                    {!itemsLoading && Object.keys(groupedItems).length === 0 ? (
                      <div style={{ textAlign: 'center', color: C.muted, padding: '20px 0' }}>
                        Abhi koi items available nahi hain
                      </div>
                    ) : (
                      Object.keys(groupedItems).map(cat => (
                        <div key={cat} style={{ marginBottom: 20 }}>
                          <div style={{
                            fontFamily: fonts.display,
                            fontSize: 14,
                            fontWeight: 700,
                            color: C.orangeLight,
                            marginBottom: 10,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}>
                            {cat}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {groupedItems[cat].filter(item => !isItemAdded(item.id)).map(item => {
                              return (
                                <div key={item.id} style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  background: C.card,
                                  borderRadius: 10,
                                  padding: '10px 12px',
                                  border: `1px solid ${C.border}`,
                                }}>
                                  <div style={{ flex: 1, fontSize: 14, color: C.text }}>
                                    {item.Name}
                                  </div>
                                  <input
                                    type="number"
                                    placeholder="₹ Price"
                                    value={itemPrices[item.id] ?? ''}
                                    onChange={e => handlePriceChange(item.id, e.target.value)}
                                    style={{
                                      width: 80,
                                      background: C.surface,
                                      border: `1px solid ${C.border}`,
                                      borderRadius: 8,
                                      padding: '7px 10px',
                                      color: C.text,
                                      fontSize: 13,
                                      outline: 'none',
                                    }}
                                  />
                                  <button
                                    onClick={() => handleAddItem(item)}
                                    style={{
                                      background: C.orange, color: '#fff', border: 'none',
                                      borderRadius: 8, padding: '7px 12px', fontSize: 12,
                                      cursor: 'pointer', fontFamily: fonts.body,
                                    }}
                                  >
                                    + Add
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authRole, setAuthRole] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setAuthRole(null);
  };

  if (!user) {
    if (!authRole) return <RoleScreen onSelect={r => setAuthRole(r)} />;
    return <AuthScreen role={authRole} onBack={() => setAuthRole(null)} />;
  }

  if (!role) return <RoleScreen onSelect={r => setRole(r)} />;

  if (role === 'customer') return <CustomerDashboard user={user} onLogout={handleLogout} />;
  if (role === 'shopkeeper') return <ShopOwnerDashboard user={user} onLogout={handleLogout} />;
  if (role === 'admin') {
    if (user.email !== 'rudrapratap.sani@gmail.com') {
      return (
        <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: fonts.body }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
          <h2 style={{ color: C.white, fontFamily: fonts.display }}>Access Denied</h2>
          <p style={{ color: C.muted, marginTop: 8 }}>Tumhare paas admin rights nahi hain.</p>
          <button className="nb-btn" onClick={handleLogout} style={{ marginTop: 24, maxWidth: 200 }}>Logout</button>
        </div>
      );
    }
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }
  return null;
}