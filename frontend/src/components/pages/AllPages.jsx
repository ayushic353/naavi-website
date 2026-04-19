import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import API from '../../api';
import Spinner from '../atoms/Spinner';
import ProductCard from '../molecules/ProductCard';
import toast from 'react-hot-toast';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/* ════════════════════════════════════════════════
   LOGIN
════════════════════════════════════════════════ */
export function LoginPage() {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) navigate('/');
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-4xl font-bold text-pearl hover:text-gold transition-colors">NAAVI</Link>
          <p className="section-label mt-3">Welcome Back</p>
        </div>
        <div className="bg-charcoal border border-ash/30 p-8">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="section-label text-[9px] block mb-2">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handle} required placeholder="you@email.com" className="naavi-input" />
            </div>
            <div>
              <label className="section-label text-[9px] block mb-2">Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} required placeholder="••••••••" className="naavi-input" />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center mt-2 disabled:opacity-50">
              {loading ? <Spinner size="sm" /> : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-mist mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold underline-gold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   REGISTER
════════════════════════════════════════════════ */
export function RegisterPage() {
  const { register, loading, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [err, setErr] = useState('');

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirm) { setErr('Passwords do not match'); return; }
    if (form.password.length < 6) { setErr('Password must be at least 6 characters'); return; }
    const res = await register(form.name, form.email, form.password);
    if (res.success) navigate('/');
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-4xl font-bold text-pearl hover:text-gold transition-colors">NAAVI</Link>
          <p className="section-label mt-3">Create Account</p>
        </div>
        <div className="bg-charcoal border border-ash/30 p-8">
          {err && <div className="bg-rouge/20 border border-rouge/40 text-rouge text-sm p-3 mb-4">{err}</div>}
          <form onSubmit={submit} className="space-y-5">
            {[
              ['name', 'Full Name', 'text', 'Your name'],
              ['email', 'Email Address', 'email', 'you@email.com'],
              ['password', 'Password', 'password', 'Min 6 characters'],
              ['confirm', 'Confirm Password', 'password', 'Re-enter password'],
            ].map(([name, label, type, ph]) => (
              <div key={name}>
                <label className="section-label text-[9px] block mb-2">{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handle} required placeholder={ph} className="naavi-input" />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center mt-2 disabled:opacity-50">
              {loading ? <Spinner size="sm" /> : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-mist mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold underline-gold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   CHECKOUT
════════════════════════════════════════════════ */
export function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.name || '', street: '', city: '', state: '',
    zip: '', country: 'India', phone: user?.phone || '',
  });
  const [payment, setPayment] = useState('cod');
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal >= 2499 ? 0 : 149;
  const tax = +(cartTotal * 0.05).toFixed(2);
  const total = cartTotal + shipping + tax;

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!cartItems.length) { toast.error('Cart is empty'); return; }
    const required = ['fullName', 'street', 'city', 'state', 'zip', 'country', 'phone'];
    if (required.some(k => !form[k])) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    try {
      const items = cartItems.filter(i => i.product).map(i => ({
        product: i.product._id, name: i.product.name,
        image: i.product.images?.[0] || '', price: i.product.price,
        size: i.size, color: i.color, quantity: i.quantity,
      }));
      const { data } = await API.post('/orders', {
        shippingAddress: form, paymentMethod: payment, items,
        itemsPrice: cartTotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total,
      });
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  if (!user) return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <div className="text-center"><p className="text-mist mb-6">Please sign in to checkout.</p><Link to="/login" className="btn-gold">Sign In</Link></div>
    </div>
  );

  if (!cartItems.length) return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <div className="text-center"><p className="text-mist mb-6">Your bag is empty.</p><Link to="/shop" className="btn-gold">Shop Now</Link></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-obsidian py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-pearl mb-10">Checkout</h1>
        <form onSubmit={submit}>
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-charcoal border border-ash/30 p-6">
                <h2 className="font-display text-2xl text-pearl mb-6">Shipping Address</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[['fullName','Full Name',true],['street','Street Address',true],['city','City',false],
                    ['state','State',false],['zip','PIN Code',false],['country','Country',false],['phone','Phone',true]
                  ].map(([name, label, full]) => (
                    <div key={name} className={full ? 'md:col-span-2' : ''}>
                      <label className="section-label text-[9px] block mb-2">{label} *</label>
                      <input name={name} value={form[name]} onChange={handle} required className="naavi-input" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-charcoal border border-ash/30 p-6">
                <h2 className="font-display text-2xl text-pearl mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {[['cod','Cash on Delivery','Pay when order arrives'],
                    ['upi','UPI','Google Pay, PhonePe, Paytm'],
                    ['card','Credit / Debit Card','Secure encrypted payment'],
                  ].map(([val, label, desc]) => (
                    <label key={val} className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${payment === val ? 'border-gold bg-gold/5' : 'border-ash/30 hover:border-ash/60'}`}>
                      <input type="radio" name="payment" value={val} checked={payment === val} onChange={() => setPayment(val)} className="accent-[#c9a96e] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-pearl">{label}</p>
                        <p className="text-xs text-mist mt-0.5">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="bg-charcoal border border-ash/30 p-6 sticky top-28">
                <h2 className="font-display text-2xl text-pearl mb-5">Your Order</h2>
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                  {cartItems.map(item => !item.product ? null : (
                    <div key={item._id} className="flex gap-3 items-start">
                      <div className="w-12 h-14 flex-shrink-0 overflow-hidden bg-graphite">
                        <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-pearl truncate">{item.product.name}</p>
                        {item.size && <p className="text-[10px] text-mist">Size: {item.size}</p>}
                        <p className="text-[10px] text-mist">×{item.quantity}</p>
                      </div>
                      <p className="text-xs font-medium text-pearl flex-shrink-0">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="gold-line mb-4" />
                <div className="space-y-2 text-sm">
                  {[['Subtotal', `₹${cartTotal.toLocaleString()}`],
                    ['Shipping', shipping === 0 ? 'Free' : `₹${shipping}`],
                    ['Tax (5%)', `₹${tax}`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-mist">{k}</span>
                      <span className={k === 'Shipping' && shipping === 0 ? 'text-sage' : 'text-pearl'}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="gold-line my-4" />
                <div className="flex justify-between font-bold text-pearl">
                  <span>Total</span><span className="font-display text-2xl">₹{total.toLocaleString()}</span>
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full justify-center mt-6 disabled:opacity-50">
                  {loading ? <Spinner size="sm" /> : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ORDERS LIST
════════════════════════════════════════════════ */
export function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    API.get('/orders/my').then(({ data }) => setOrders(data.orders)).catch(() => {}).finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="min-h-screen bg-obsidian flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-obsidian py-10">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="font-display text-4xl font-bold text-pearl mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl text-ash mb-4">No orders yet</p>
            <Link to="/shop" className="btn-gold">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order._id} onClick={() => navigate(`/orders/${order._id}`)}
                className="bg-charcoal border border-ash/30 p-5 cursor-pointer hover:border-gold/40 transition-all group">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="section-label text-[9px] mb-1">Order ID</p><p className="font-mono-custom text-xs text-silver">#{order._id.slice(-12).toUpperCase()}</p></div>
                  <div><p className="section-label text-[9px] mb-1">Date</p><p className="text-sm text-silver">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
                  <div><p className="section-label text-[9px] mb-1">Items</p><p className="text-sm text-silver">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p></div>
                  <div><p className="section-label text-[9px] mb-1">Total</p><p className="text-sm font-semibold text-pearl">₹{order.totalPrice.toLocaleString()}</p></div>
                  <div>
                    <p className="section-label text-[9px] mb-1">Status</p>
                    <span className={`naavi-badge text-[9px] ${order.orderStatus === 'delivered' ? 'text-sage border border-sage/40' : order.orderStatus === 'cancelled' ? 'text-ember border border-ember/40' : 'text-gold border border-gold/40'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono-custom text-mist group-hover:text-gold transition-colors uppercase tracking-wider">View →</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ORDER DETAIL
════════════════════════════════════════════════ */
export function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => navigate('/orders')).finally(() => setLoading(false));
  }, [id, user, navigate]);

  if (loading) return <div className="min-h-screen bg-obsidian flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-obsidian py-10">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <button onClick={() => navigate('/orders')} className="section-label text-[9px] mb-6 hover:text-gold transition-colors cursor-pointer">← Back to Orders</button>
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-pearl">Order Detail</h1>
            <p className="font-mono-custom text-xs text-mist mt-1">#{order._id.slice(-12).toUpperCase()}</p>
          </div>
          <span className={`naavi-badge ${order.orderStatus === 'delivered' ? 'text-sage border border-sage/40' : order.orderStatus === 'cancelled' ? 'text-ember border border-ember/40' : 'text-gold border border-gold/40'}`}>
            {order.orderStatus}
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-charcoal border border-ash/30 p-5">
            <h3 className="section-label text-[9px] mb-4">Items Ordered</h3>
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center py-3 border-b border-ash/20 last:border-0">
                <div className="w-12 h-14 overflow-hidden bg-graphite flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.src='https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-pearl truncate">{item.name}</p>
                  {item.size && <p className="text-[10px] text-mist">Size: {item.size}</p>}
                  <p className="text-[10px] text-mist">×{item.quantity}</p>
                </div>
                <p className="text-sm text-pearl flex-shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-charcoal border border-ash/30 p-5">
              <h3 className="section-label text-[9px] mb-4">Shipping Address</h3>
              <p className="text-sm text-silver">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-mist">{order.shippingAddress.street}</p>
              <p className="text-sm text-mist">{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.zip}</p>
              <p className="text-sm text-mist">{order.shippingAddress.country}</p>
              <p className="text-sm text-mist mt-1">{order.shippingAddress.phone}</p>
            </div>
            <div className="bg-charcoal border border-ash/30 p-5">
              <h3 className="section-label text-[9px] mb-4">Payment & Summary</h3>
              <div className="space-y-2 text-sm mb-3">
                {[['Method', order.paymentMethod.toUpperCase()],['Items',`₹${order.itemsPrice.toLocaleString()}`],['Shipping',order.shippingPrice===0?'Free':`₹${order.shippingPrice}`],['Tax',`₹${order.taxPrice}`]].map(([k,v]) => (
                  <div key={k} className="flex justify-between"><span className="text-mist">{k}</span><span className="text-pearl">{v}</span></div>
                ))}
              </div>
              <div className="gold-line mb-3" />
              <div className="flex justify-between font-bold text-pearl">
                <span>Total</span><span className="font-display text-xl">₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   WISHLIST
════════════════════════════════════════════════ */
export function WishlistPage() {
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();

  if (!user) return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <div className="text-center"><p className="font-display text-3xl text-pearl mb-4">My Wishlist</p><Link to="/login" className="btn-gold">Sign In</Link></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-obsidian py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <p className="section-label mb-2">Saved</p>
        <h1 className="font-display text-4xl font-bold text-pearl mb-2">My Wishlist</h1>
        <p className="text-mist text-sm mb-10">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</p>
        {wishlistItems.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl text-ash mb-4">Your wishlist is empty</p>
            <Link to="/shop" className="btn-gold">Discover Pieces <ArrowForwardIcon sx={{ fontSize: 16 }} /></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {wishlistItems.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PROFILE
════════════════════════════════════════════════ */
export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '', city: user?.address?.city || '', state: user?.address?.state || '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone, address: { city: form.city, state: form.state } };
      if (form.password) payload.password = form.password;
      await API.put('/users/profile', payload);
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-obsidian py-10">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <p className="section-label mb-3">Account</p>
        <h1 className="font-display text-4xl font-bold text-pearl mb-8">My Profile</h1>
        <div className="bg-charcoal border border-ash/30 p-6">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-ash/20">
            <div className="w-16 h-16 bg-graphite border border-ash/40 flex items-center justify-center font-display text-3xl text-gold select-none">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-pearl text-lg">{user?.name}</p>
              <p className="text-sm text-mist">{user?.email}</p>
              {user?.role === 'admin' && <span className="naavi-badge text-gold border border-gold/40 mt-1 inline-block">Admin</span>}
            </div>
          </div>
          <form onSubmit={save} className="space-y-4">
            {[['name','Full Name','text'],['phone','Phone Number','tel'],['city','City','text'],['state','State','text']].map(([name, label, type]) => (
              <div key={name}>
                <label className="section-label text-[9px] block mb-2">{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handle} className="naavi-input" />
              </div>
            ))}
            <div>
              <label className="section-label text-[9px] block mb-2">New Password <span className="normal-case text-mist tracking-normal">(leave blank to keep current)</span></label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" className="naavi-input" />
            </div>
            <div className="flex gap-3 pt-2 flex-wrap">
              <button type="submit" disabled={saving} className="btn-gold disabled:opacity-50">{saving ? <Spinner size="sm" /> : 'Save Changes'}</button>
              <button type="button" onClick={() => navigate('/orders')} className="btn-ghost">My Orders</button>
              <button type="button" onClick={() => { logout(); navigate('/'); }} className="btn-ghost" style={{ borderColor: 'rgba(196,92,58,0.4)', color: '#c45c3a' }}>Sign Out</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ABOUT
════════════════════════════════════════════════ */
export function AboutPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <div className="relative h-80 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1400" alt="About" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 to-obsidian/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="section-label mb-3">Est. 2022</p>
            <h1 className="font-display text-6xl font-bold text-pearl">About NAAVI</h1>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 space-y-20">
        {[
          { num: '01', title: 'The Story', id: 'story', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', body: 'NAAVI was born from a simple belief: that Indian women deserve fashion that honours their heritage without compromising on contemporary style. Founded in Mumbai, we curate clothing that bridges tradition and modernity — from heirloom-worthy Banarasi sarees to perfectly cut blazers that command any room.' },
          { num: '02', title: 'Sustainability', id: 'sustainability', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600', body: 'NAAVI partners only with artisans and manufacturers who uphold ethical practices. Our packaging is 100% recyclable, we offset our carbon footprint, and we are committed to reducing textile waste by offering timeless pieces over trend-chasing.' },
          { num: '03', title: 'Join Our Team', id: 'careers', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600', body: 'We are always looking for passionate individuals who share our vision. From fashion buyers and digital marketers to technology specialists — if you love fashion and want to build something meaningful, write to us at careers@naavi.in.' },
        ].map((s, i) => (
          <div key={s.id} id={s.id} className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
            <div className={i % 2 === 1 ? 'md:col-start-2' : ''}>
              <p className="section-label mb-2">{s.num}</p>
              <h2 className="font-display text-4xl font-bold text-pearl mb-4">{s.title}</h2>
              <div className="gold-line w-14 mb-6" />
              <p className="text-silver leading-relaxed">{s.body}</p>
            </div>
            <div className={`overflow-hidden bg-graphite aspect-square ${i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
              <img src={s.img} alt={s.title} className="w-full h-full object-cover opacity-70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   CONTACT
════════════════════════════════════════════════ */
export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <div className="min-h-screen bg-obsidian py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Reach Out</p>
          <h1 className="font-display text-5xl font-bold text-pearl">Contact Us</h1>
          <div className="gold-line w-16 mx-auto mt-5" />
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-silver leading-relaxed mb-10">We'd love to hear from you. Whether it's a question about a product, help with your order, or just a hello — our team is always here.</p>
            {[['📍','Address','NAAVI House, Bandra West\nMumbai 400050, India'],['📞','Phone','+91 98765 43210\nMon–Sat, 10am–7pm IST'],['✉️','Email','hello@naavi.in'],['⏱️','Response','Within 24 hours on working days']].map(([icon, label, value]) => (
              <div key={label} className="flex gap-4 mb-6">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="section-label text-[9px] mb-1">{label}</p>
                  {value.split('\n').map((line, i) => <p key={i} className="text-sm text-silver">{line}</p>)}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-charcoal border border-ash/30 p-7">
            {sent ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4"><span className="text-gold text-2xl">✓</span></div>
                <p className="font-display text-3xl text-pearl mb-2">Message Sent!</p>
                <p className="text-mist text-sm">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="btn-outline-gold mt-6 text-xs">Send Another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h2 className="font-display text-2xl text-pearl mb-5">Send a Message</h2>
                {[['name','Your Name','text'],['email','Email Address','email'],['subject','Subject','text']].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="section-label text-[9px] block mb-2">{label}</label>
                    <input name={name} type={type} value={form[name]} onChange={handle} required className="naavi-input" />
                  </div>
                ))}
                <div>
                  <label className="section-label text-[9px] block mb-2">Message</label>
                  <textarea name="message" value={form.message} onChange={handle} required rows={5} placeholder="How can we help you?" className="naavi-input resize-none" />
                </div>
                <button type="submit" className="btn-gold w-full justify-center">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   HELP
════════════════════════════════════════════════ */
export function HelpPage() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: 'How long does shipping take?', a: 'Standard delivery takes 3–5 business days. Express (1–2 days) is available at checkout for a small fee.' },
    { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached.' },
    { q: 'How do I track my order?', a: "Once shipped, you'll receive an email with a tracking link. You can also track from the My Orders section in your account." },
    { q: 'Do you offer size exchanges?', a: 'Yes! We offer free size exchanges within 30 days. Initiate a return from your order page and place a new order for the correct size.' },
    { q: 'Are the sarees pre-stitched?', a: 'Unless specified, sarees are unstitched. Blouse piece is included with most sarees. Custom stitching can be requested at checkout.' },
    { q: 'How do I care for my garments?', a: 'Care instructions are included with each item. Dry cleaning is recommended for silk and embroidered pieces; gentle machine wash for cotton.' },
    { q: 'Do you ship internationally?', a: 'Currently we ship within India only. International shipping is coming soon — sign up to our newsletter to be notified.' },
    { q: 'How do I contact customer support?', a: 'Email us at hello@naavi.in or call +91 98765 43210, Monday to Saturday, 10am–7pm IST.' },
  ];

  return (
    <div className="min-h-screen bg-obsidian py-16">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Support</p>
          <h1 className="font-display text-5xl font-bold text-pearl">Help Centre</h1>
          <div className="gold-line w-16 mx-auto mt-5" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[['🚚','Shipping','shipping'],['↩️','Returns','returns'],['📏','Size Guide','sizing']].map(([icon, label, id]) => (
            <a key={id} href={`#${id}`} className="bg-charcoal border border-ash/30 hover:border-gold/40 p-4 text-center transition-all group">
              <span className="text-2xl block mb-2">{icon}</span>
              <p className="section-label text-[9px] group-hover:text-gold transition-colors">{label}</p>
            </a>
          ))}
        </div>
        <div id="sizing" className="bg-charcoal border border-ash/30 p-6 mb-8">
          <h2 className="font-display text-2xl text-pearl mb-4">Size Guide</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-ash/20">{['Size','Bust (in)','Waist (in)','Hip (in)'].map(h => <th key={h} className="text-left py-2 pr-4 section-label text-[9px]">{h}</th>)}</tr></thead>
              <tbody>
                {[['XS','32','26','35'],['S','34','28','37'],['M','36','30','39'],['L','38','32','41'],['XL','40','34','43'],['XXL','42','36','45']].map(([size,...vals]) => (
                  <tr key={size} className="border-b border-ash/10">
                    <td className="py-2 pr-4 text-gold font-mono-custom font-bold">{size}</td>
                    {vals.map((v,i) => <td key={i} className="py-2 pr-4 text-silver">{v}"</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <h2 className="font-display text-3xl font-bold text-pearl mb-6">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-charcoal border border-ash/30 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-graphite transition-colors">
                <span className="text-sm font-medium text-pearl pr-4">{faq.q}</span>
                <span className="text-gold text-lg flex-shrink-0" style={{ transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>+</span>
              </button>
              {open === i && <div className="px-5 pb-5 text-sm text-silver leading-relaxed border-t border-ash/20 pt-4">{faq.a}</div>}
            </div>
          ))}
        </div>
        <div className="mt-12 bg-charcoal border border-gold/20 p-8 text-center">
          <p className="font-display text-2xl text-pearl mb-2">Still need help?</p>
          <p className="text-mist text-sm mb-6">Our team is available Mon–Sat, 10am–7pm IST</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/contact" className="btn-gold text-xs">Contact Us</Link>
            <a href="mailto:hello@naavi.in" className="btn-outline-gold text-xs">Email Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ADMIN
════════════════════════════════════════════════ */
export function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: 'kurtas', stock: '', images: '', isFeatured: false, isNewArrival: false, isDealOfMonth: false, isBestSeller: false });

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    Promise.all([API.get('/products?limit=200'), API.get('/orders')])
      .then(([p, o]) => { setProducts(p.data.products); setOrders(o.data.orders); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [user, navigate]);

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await API.delete(`/products/${id}`); setProducts(ps => ps.filter(p => p._id !== id)); toast.success('Product deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newProduct, price: +newProduct.price, stock: +newProduct.stock, images: newProduct.images ? [newProduct.images] : [] };
      const { data } = await API.post('/products', payload);
      setProducts(ps => [data.product, ...ps]);
      setNewProduct({ name: '', description: '', price: '', category: 'kurtas', stock: '', images: '', isFeatured: false, isNewArrival: false, isDealOfMonth: false, isBestSeller: false });
      toast.success('Product added!'); setTab('products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const updateStatus = async (orderId, status) => {
    try { await API.put(`/orders/${orderId}/status`, { orderStatus: status }); setOrders(os => os.map(o => o._id === orderId ? { ...o, orderStatus: status } : o)); toast.success('Updated'); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <div className="min-h-screen bg-obsidian flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-obsidian py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div><p className="section-label mb-1">Dashboard</p><h1 className="font-display text-4xl font-bold text-pearl">Admin Panel</h1></div>
          <div className="flex gap-2 flex-wrap">
            {[['products',`Products (${products.length})`],['orders',`Orders (${orders.length})`],['add','+ Add Product']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 text-[10px] font-mono-custom uppercase tracking-wider border transition-all ${tab === key ? 'bg-gold text-obsidian border-gold' : 'border-ash/40 text-silver hover:border-gold'}`}>{label}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[['Total Products', products.length, 'text-gold'],['Total Orders', orders.length, 'text-pearl'],['Revenue', `₹${orders.reduce((s,o)=>s+o.totalPrice,0).toLocaleString()}`, 'text-sage'],['Out of Stock', products.filter(p=>p.stock===0).length, 'text-ember']].map(([label, value, cls]) => (
            <div key={label} className="bg-charcoal border border-ash/30 p-4">
              <p className="section-label text-[9px] mb-1">{label}</p>
              <p className={`font-display text-3xl font-bold ${cls}`}>{value}</p>
            </div>
          ))}
        </div>

        {tab === 'products' && (
          <div className="bg-charcoal border border-ash/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-ash/30">{['Product','Category','Price','Stock','Flags','Delete'].map(h=><th key={h} className="text-left py-3 px-4 section-label text-[9px]">{h}</th>)}</tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} className="border-b border-ash/20 hover:bg-graphite transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 overflow-hidden bg-graphite flex-shrink-0"><img src={p.images?.[0]} alt="" className="w-full h-full object-cover" onError={e=>{e.target.src='https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100';}} /></div>
                          <span className="text-pearl text-xs line-clamp-1 max-w-48">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-mist text-xs capitalize">{p.category}</td>
                      <td className="py-3 px-4 text-pearl text-xs">₹{p.price.toLocaleString()}</td>
                      <td className="py-3 px-4"><span className={`text-xs font-mono-custom ${p.stock===0?'text-ember':p.stock<10?'text-gold':'text-sage'}`}>{p.stock}</span></td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {p.isFeatured && <span className="naavi-badge text-[8px] text-gold border border-gold/30">F</span>}
                          {p.isNewArrival && <span className="naavi-badge text-[8px] text-sage border border-sage/30">N</span>}
                          {p.isDealOfMonth && <span className="naavi-badge text-[8px] text-ember border border-ember/30">D</span>}
                          {p.isBestSeller && <span className="naavi-badge text-[8px] text-silver border border-silver/30">B</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4"><button onClick={() => deleteProduct(p._id)} className="text-[10px] font-mono-custom text-ember hover:opacity-70 uppercase tracking-wider">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="bg-charcoal border border-ash/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-ash/30">{['Order','Customer','Date','Total','Payment','Status','Update'].map(h=><th key={h} className="text-left py-3 px-4 section-label text-[9px]">{h}</th>)}</tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} className="border-b border-ash/20 hover:bg-graphite transition-colors">
                      <td className="py-3 px-4 font-mono-custom text-[10px] text-mist">#{o._id.slice(-8).toUpperCase()}</td>
                      <td className="py-3 px-4 text-pearl text-xs">{o.user?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-mist text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                      <td className="py-3 px-4 text-pearl text-xs">₹{o.totalPrice.toLocaleString()}</td>
                      <td className="py-3 px-4"><span className={`naavi-badge text-[9px] ${o.paymentStatus==='paid'?'text-sage border border-sage/40':'text-mist border border-mist/30'}`}>{o.paymentStatus}</span></td>
                      <td className="py-3 px-4"><span className={`naavi-badge text-[9px] ${o.orderStatus==='delivered'?'text-sage border border-sage/40':o.orderStatus==='cancelled'?'text-ember border border-ember/40':'text-gold border border-gold/40'}`}>{o.orderStatus}</span></td>
                      <td className="py-3 px-4">
                        <select value={o.orderStatus} onChange={e => updateStatus(o._id, e.target.value)} className="bg-graphite border border-ash/30 text-silver text-[10px] py-1.5 px-2 outline-none focus:border-gold">
                          {['processing','confirmed','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'add' && (
          <div className="max-w-2xl">
            <div className="bg-charcoal border border-ash/30 p-6">
              <h2 className="font-display text-2xl text-pearl mb-6">Add New Product</h2>
              <form onSubmit={addProduct} className="space-y-4">
                {[['name','Product Name','text'],['description','Description','text'],['price','Price (₹)','number'],['stock','Stock Quantity','number'],['images','Image URL','url']].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="section-label text-[9px] block mb-2">{label} *</label>
                    <input name={name} type={type} value={newProduct[name]} onChange={e => setNewProduct(p=>({...p,[name]:e.target.value}))} required={name !== 'images'} className="naavi-input" min={type==='number'?0:undefined} />
                  </div>
                ))}
                <div>
                  <label className="section-label text-[9px] block mb-2">Category *</label>
                  <select value={newProduct.category} onChange={e => setNewProduct(p=>({...p,category:e.target.value}))} className="naavi-input">
                    {['kurtas','suits','sarees','jackets','scarves','dresses','tops','tshirts','jeans'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {[['isFeatured','Featured'],['isNewArrival','New Arrival'],['isDealOfMonth','Deal of Month'],['isBestSeller','Best Seller']].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newProduct[key]} onChange={e => setNewProduct(p=>({...p,[key]:e.target.checked}))} className="accent-[#c9a96e] w-4 h-4" />
                      <span className="text-sm text-silver">{label}</span>
                    </label>
                  ))}
                </div>
                <button type="submit" className="btn-gold mt-2">Add Product</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   404
════════════════════════════════════════════════ */
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center text-center px-4">
      <div>
        <p className="font-display font-bold text-charcoal leading-none select-none" style={{ fontSize: 'clamp(6rem,20vw,14rem)' }}>404</p>
        <p className="font-display text-3xl text-pearl mb-3 -mt-4">Page Not Found</p>
        <p className="text-mist text-sm mb-8">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn-gold">Return Home</Link>
      </div>
    </div>
  );
}
