import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const CATEGORIES = [
  { label: 'Kurtas', slug: 'kurtas' },
  { label: 'Suits', slug: 'suits' },
  { label: 'Sarees', slug: 'sarees' },
  { label: 'Jackets', slug: 'jackets' },
  { label: 'Scarves', slug: 'scarves' },
  { label: 'Dresses', slug: 'dresses' },
  { label: 'Tops', slug: 'tops' },
  { label: 'T-Shirts', slug: 'tshirts' },
  { label: 'Jeans', slug: 'jeans' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const shopRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setShopMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopMenuOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gold text-obsidian text-center py-2 text-[10px] tracking-[0.25em] font-mono-custom uppercase">
        Free shipping on orders above ₹2499 &nbsp;·&nbsp; Use code NAAVI15 for 15% off
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-obsidian/95 backdrop-blur-md border-b border-ash/30 shadow-xl shadow-black/40'
            : 'bg-charcoal border-b border-ash/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-pearl/70 hover:text-gold transition-colors p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="font-display text-3xl md:text-4xl font-bold tracking-[0.1em] text-pearl absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 hover:text-gold transition-colors duration-300"
            >
              NAAVI
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              <NavLink to="/" className={({ isActive }) =>
                `text-[11px] font-mono-custom uppercase tracking-[0.15em] transition-colors ${isActive ? 'text-gold' : 'text-silver hover:text-pearl'}`
              }>
                Home
              </NavLink>

              {/* Shop dropdown */}
              <div className="relative" ref={shopRef}>
                <button
                  onClick={() => setShopMenuOpen(!shopMenuOpen)}
                  className="text-[11px] font-mono-custom uppercase tracking-[0.15em] text-silver hover:text-pearl transition-colors flex items-center gap-1"
                >
                  Shop <KeyboardArrowDownIcon sx={{ fontSize: 14, transition: 'transform 0.2s', transform: shopMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>

                {shopMenuOpen && (
                  <div className="absolute top-8 left-0 bg-charcoal border border-ash/50 shadow-2xl shadow-black/60 z-50 w-56 animate-fade-in">
                    <div className="p-1">
                      <Link to="/shop" className="block px-4 py-2.5 text-[10px] font-mono-custom uppercase tracking-widest text-gold border-b border-ash/30 hover:bg-graphite transition-colors">
                        All Products
                      </Link>
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          to={`/shop?category=${cat.slug}`}
                          className="block px-4 py-2.5 text-sm text-silver hover:text-pearl hover:bg-graphite transition-colors"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <NavLink to="/about" className={({ isActive }) =>
                `text-[11px] font-mono-custom uppercase tracking-[0.15em] transition-colors ${isActive ? 'text-gold' : 'text-silver hover:text-pearl'}`
              }>
                About
              </NavLink>

              <NavLink to="/contact" className={({ isActive }) =>
                `text-[11px] font-mono-custom uppercase tracking-[0.15em] transition-colors ${isActive ? 'text-gold' : 'text-silver hover:text-pearl'}`
              }>
                Contact
              </NavLink>

              <NavLink to="/help" className={({ isActive }) =>
                `text-[11px] font-mono-custom uppercase tracking-[0.15em] transition-colors ${isActive ? 'text-gold' : 'text-silver hover:text-pearl'}`
              }>
                Help
              </NavLink>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-silver hover:text-gold transition-colors"
                aria-label="Search"
              >
                <SearchIcon sx={{ fontSize: 20 }} />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative text-silver hover:text-gold transition-colors" aria-label="Wishlist">
                <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold text-obsidian text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono-custom font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative text-silver hover:text-gold transition-colors" aria-label="Cart">
                <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold text-obsidian text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono-custom font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="text-silver hover:text-gold transition-colors"
                  aria-label="Account"
                >
                  <PersonOutlineIcon sx={{ fontSize: 20 }} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-9 w-52 bg-charcoal border border-ash/50 shadow-2xl shadow-black/60 z-50 animate-fade-in">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-ash/30">
                          <p className="section-label">Signed in as</p>
                          <p className="text-sm text-pearl font-medium mt-0.5 truncate">{user.name}</p>
                        </div>
                        {[
                          { label: 'My Profile', to: '/profile' },
                          { label: 'My Orders', to: '/orders' },
                          { label: 'Wishlist', to: '/wishlist' },
                        ].map((item) => (
                          <Link key={item.to} to={item.to} className="block px-4 py-2.5 text-sm text-silver hover:text-pearl hover:bg-graphite transition-colors">
                            {item.label}
                          </Link>
                        ))}
                        {user.role === 'admin' && (
                          <Link to="/admin" className="block px-4 py-2.5 text-sm text-gold hover:bg-graphite transition-colors">
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2.5 text-sm text-silver hover:text-pearl hover:bg-graphite transition-colors border-t border-ash/30"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-4 py-3 text-sm text-pearl hover:bg-graphite transition-colors">Sign In</Link>
                        <Link to="/register" className="block px-4 py-3 text-sm text-silver hover:text-pearl hover:bg-graphite transition-colors border-t border-ash/30">Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-ash/30 bg-charcoal animate-fade-in">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-4 flex gap-3">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search kurtas, sarees, dresses…"
                className="naavi-input flex-1"
              />
              <button type="submit" className="btn-gold py-2 px-6 whitespace-nowrap">
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="text-silver hover:text-pearl transition-colors">
                <CloseIcon fontSize="small" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-ash/30 bg-charcoal animate-fade-in">
            <nav className="px-4 py-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'All Products', to: '/shop' },
                ...CATEGORIES.map((c) => ({ label: c.label, to: `/shop?category=${c.slug}` })),
                { label: 'About', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Help', to: '/help' },
              ].map((item) => (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  className="block py-3 text-sm text-silver hover:text-gold transition-colors border-b border-ash/20"
                >
                  {item.label}
                </Link>
              ))}
              <div className="py-3">
                {user ? (
                  <>
                    <Link to="/profile" className="block py-2 text-sm text-silver hover:text-gold transition-colors">My Profile</Link>
                    <Link to="/orders" className="block py-2 text-sm text-silver hover:text-gold transition-colors">My Orders</Link>
                    <button onClick={logout} className="block py-2 text-sm text-silver hover:text-gold transition-colors">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block py-2 text-sm text-pearl hover:text-gold transition-colors">Sign In</Link>
                    <Link to="/register" className="block py-2 text-sm text-silver hover:text-gold transition-colors">Create Account</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
