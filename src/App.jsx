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

  const mockShops = [
    { id: 1, name: 'Sharma General Store', location: 'Sector 18', category: 'Grocery', emoji: '🛒' },
    { id: 2, name: 'Noida Medicos', location: 'Sector 18', category: 'Medical', emoji: '💊' },
    { id: 3, name: 'Fresh Vegetables Wala', location: 'Sector 62', category: 'Vegetables', emoji: '🥦' },
    { id: 4, name: 'Verma Electronics', location: 'Sector 50', category: 'Electronics', emoji: '📱' },
    { id: 5, name: 'Kapoor Sweets', location: 'Sector 44', category: 'Food', emoji: '🍬' },
  ];

  const filtered = mockShops.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

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
            {filtered.length} shops mile • Sector 18 ke aas paas
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(shop => (
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

          {filtered.length === 0 && (
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

// ─── Coming Soon Panel ────────────────────────────────────────────────────────
function ComingSoonPanel({ role, user, onLogout }) {
  const labels = { shopkeeper: '🏪 Shop Owner Panel', admin: '⚙️ Admin Panel' };
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: fonts.body }}>
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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

      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 57px)',
        padding: 24, textAlign: 'center',
      }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🚀</div>
        <h2 style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 800, color: C.white }}>
          {labels[role]}
        </h2>
        <p style={{ color: C.muted, marginTop: 10, fontSize: 15, maxWidth: 280 }}>
          Yeh panel abhi ban raha hai. Jald aayega!
        </p>
        <div style={{
          marginTop: 24,
          background: C.orange + '11',
          border: `1px solid ${C.orange}33`,
          borderRadius: 10,
          padding: '12px 20px',
          color: C.orange,
          fontWeight: 600,
          fontSize: 14,
        }}>
          ⚡ Coming Soon
        </div>
        <p style={{ color: C.muted, fontSize: 12, marginTop: 16 }}>{user?.email}</p>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authRole, setAuthRole] = useState(null); // role selected for login

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

  // Not logged in: show role selection or auth screen
  if (!user) {
    if (!authRole) return <RoleScreen onSelect={r => setAuthRole(r)} />;
    return <AuthScreen role={authRole} onBack={() => setAuthRole(null)} />;
  }

  // Logged in but role not picked yet
  if (!role) return <RoleScreen onSelect={r => setRole(r)} />;

  // Logged in with role
  if (role === 'customer') return <CustomerDashboard user={user} onLogout={handleLogout} />;
  return <ComingSoonPanel role={role} user={user} onLogout={handleLogout} />;
}