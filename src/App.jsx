import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function App() {
  const [role, setRole] = useState(null)
  const [shops, setShops] = useState([])
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (role === 'customer') fetchShops()
  }, [role])

  async function fetchShops() {
    setLoading(true)
    const { data, error } = await supabase.from('shops').select('*')
    if (error) setMessage('Error: ' + error.message)
    else setShops(data)
    setLoading(false)
  }

  async function searchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('items')
      .select('*, shops(name, sector)')
      .ilike('name', `%${search}%`)
    if (error) setMessage('Error: ' + error.message)
    else setItems(data)
    setLoading(false)
  }

  if (!role) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '50px', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#667eea', marginBottom: '10px' }}>🛍️ NearBuy</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Apne sector ki dukaan, apni bhasha mein</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setRole('customer')} style={{ padding: '15px', background: '#667eea', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer' }}>🛒 Customer Login</button>
          <button onClick={() => setRole('owner')} style={{ padding: '15px', background: '#764ba2', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer' }}>🏪 Shop Owner Login</button>
          <button onClick={() => setRole('admin')} style={{ padding: '15px', background: '#f093fb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer' }}>⚙️ Admin Login</button>
        </div>
      </div>
    </div>
  )

  if (role === 'customer') return (
    <div style={{ fontFamily: 'Arial', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: '#667eea', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>🛍️ NearBuy</h2>
        <button onClick={() => setRole(null)} style={{ background: 'rgba(255,255,255,0.3)', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kya dhundh rahe ho?" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} />
          <button onClick={searchItems} style={{ padding: '12px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>🔍</button>
        </div>
        {message && <p style={{ color: 'red' }}>{message}</p>}
        {loading && <p>Loading...</p>}
        {items.length > 0 && (
          <div>
            <h3>Search Results:</h3>
            {items.map(item => (
              <div key={item.id} style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <strong>{item.name}</strong> — ₹{item.price}
                <br /><small style={{ color: '#666' }}>📍 {item.shops?.name}, {item.shops?.sector}</small>
              </div>
            ))}
          </div>
        )}
        <h3>Nearby Shops:</h3>
        {shops.map(shop => (
          <div key={shop.id} style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <strong>{shop.name}</strong>
            <br /><small style={{ color: '#666' }}>📍 {shop.area} | {shop.category}</small>
          </div>
        ))}
      </div>
    </div>
  )

  if (role === 'owner') return (
    <div style={{ fontFamily: 'Arial', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: '#764ba2', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>🏪 Shop Owner Panel</h2>
        <button onClick={() => setRole(null)} style={{ background: 'rgba(255,255,255,0.3)', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Apni dukaan register karo aur items add karo</p>
        <p style={{ color: '#764ba2', fontSize: '1.2rem' }}>🚧 Coming Soon!</p>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Arial', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: '#f093fb', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>⚙️ Admin Panel</h2>
        <button onClick={() => setRole(null)} style={{ background: 'rgba(255,255,255,0.3)', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Saare shops aur users manage karo</p>
        <p style={{ color: '#f093fb', fontSize: '1.2rem' }}>🚧 Coming Soon!</p>
      </div>
    </div>
  )
}
