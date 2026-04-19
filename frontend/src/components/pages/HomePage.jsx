import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import ProductCard from '../molecules/ProductCard';
import Spinner from '../atoms/Spinner';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const CATEGORIES = [
  { label: 'Kurtas', slug: 'kurtas', image: 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/52d971825016137cf6361fca6de685b8202cde30.jpg', desc: 'Heritage craft, modern soul' },
  { label: 'Sarees', slug: 'sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500', desc: 'Six yards of elegance' },
  { label: 'Suits', slug: 'suits', image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Coordinated perfection' },
  { label: 'Dresses', slug: 'dresses', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500', desc: 'Effortless femininity' },
  { label: 'Jackets', slug: 'jackets', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', desc: 'Structure & statement' },
  { label: 'Jeans', slug: 'jeans', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', desc: 'Casual with intention' },
];

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-obsidian">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600"
          alt="NAAVI Hero"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-10">
        <div className="max-w-2xl">
          <p className="section-label animate-fade-up s1 mb-6">SS 2025 Collection</p>

          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-pearl leading-[0.9] animate-fade-up s2">
            Dress<br />
            <em className="not-italic text-gold">the</em><br />
            Woman
          </h1>

          <div className="gold-line w-24 mt-8 mb-6 animate-fade-up s3" />

          <p className="text-silver text-lg font-light leading-relaxed max-w-md animate-fade-up s4">
            Kurtas rooted in craft. Sarees reborn in silk. Dresses that tell your story. NAAVI is where Indian heritage meets the modern woman.
          </p>

          <div className="flex flex-wrap gap-4 mt-10 animate-fade-up s5">
            <Link to="/shop" className="btn-gold text-sm">
              Shop the Collection
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </Link>
            <Link to="/shop?newArrival=true" className="btn-outline-gold text-sm">
              New Arrivals
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-16 animate-fade-up s5">
            {[['500+', 'Styles'], ['50K+', 'Happy Customers'], ['100%', 'Authentic']].map(([num, label]) => (
              <div key={label}>
                <p className="font-display text-3xl font-bold text-gold">{num}</p>
                <p className="text-xs text-mist font-mono-custom uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating product image */}
      <div className="absolute right-0 bottom-0 top-0 w-1/2 hidden lg:block">
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-72 h-96 overflow-hidden border border-ash/30 shadow-2xl shadow-black">
          <img
            src="https://images.unsplash.com/photo-1735553816811-7f8bb61fbf08?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Featured piece"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-charcoal/90 border border-ash/40 p-3">
            <p className="section-label text-[9px]">Featured</p>
            <p className="text-sm text-pearl font-medium mt-0.5">Midnight Bloom Anarkali</p>
            <p className="text-xs text-gold font-mono-custom mt-0.5">₹2,499</p>
          </div>
        </div>
        <div className="absolute right-64 top-1/3 w-44 h-56 overflow-hidden border border-ash/20 shadow-xl shadow-black/50">
          <img
            src="https://images.unsplash.com/photo-1580854898508-4761a9c769a9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Saree"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold" />
        <p className="section-label text-[9px]">Scroll</p>
      </div>
    </section>
  );
}

function CategoryGrid() {
  return (
    <section className="py-20 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Explore</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-pearl">Shop by Category</h2>
          <div className="gold-line w-16 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden bg-graphite"
              style={{ aspectRatio: i < 2 ? '4/5' : '3/4' }}
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-700 group-hover:scale-110"
                style={{ transition: 'transform 0.7s ease, opacity 0.4s ease' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="section-label text-[9px] mb-1">{cat.desc}</p>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-pearl">{cat.label}</h3>
                <p className="text-xs text-gold flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop now <ArrowRightAltIcon sx={{ fontSize: 14 }} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection({ title, label, products, viewLink }) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">{label}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-pearl">{title}</h2>
          </div>
          <Link to={viewLink} className="text-gold text-sm font-mono-custom uppercase tracking-wider underline-gold flex items-center gap-1 hover:text-gold-light transition-colors">
            View All <ArrowForwardIcon sx={{ fontSize: 14 }} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

function DealsBanner({ deals }) {
  const [time, setTime] = useState({ h: 11, m: 47, s: 33 });

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (--s < 0) { s = 59; if (--m < 0) { m = 59; if (--h < 0) h = 23; } }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="py-20 bg-graphite">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="section-label mb-2">Limited Time</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-pearl">Deals of the Month</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="section-label text-[9px] mr-2">Ends in</span>
            {[pad(time.h), pad(time.m), pad(time.s)].map((unit, i) => (
              <React.Fragment key={i}>
                <div className="w-12 h-12 bg-charcoal border border-ash/40 flex items-center justify-center font-mono-custom text-gold font-bold text-lg">
                  {unit}
                </div>
                {i < 2 && <span className="text-gold font-bold text-lg">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {deals.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

function FeatureStrip() {
  return (
    <section className="border-y border-ash/30 py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x divide-ash/30">
          {[
            { icon: '✦', title: 'Free Shipping', desc: 'On orders above ₹2499' },
            { icon: '↩', title: 'Easy Returns', desc: '30-day hassle-free returns' },
            { icon: '◈', title: 'Authentic Craft', desc: 'Handpicked & verified' },
            { icon: '◉', title: 'Secure Payments', desc: 'Encrypted & safe checkout' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3 md:px-6 first:pl-0">
              <span className="text-gold text-xl mt-0.5">{f.icon}</span>
              <div>
                <p className="text-sm font-semibold text-pearl">{f.title}</p>
                <p className="text-xs text-mist mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialBanner() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Large left */}
          <Link to="/shop?category=sarees" className="group relative overflow-hidden md:col-span-2 bg-graphite" style={{ aspectRatio: '16/9' }}>
            <img
              src="https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Sarees"
              className="w-full h-full object-cover opacity-50 group-hover:opacity-65 transition-all duration-700"
              style={{ transition: 'transform 0.7s ease, opacity 0.4s ease' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="section-label mb-2">Heritage Collection</p>
              <h3 className="font-display text-4xl font-bold text-pearl">The Saree Edit</h3>
              <span className="mt-3 inline-flex items-center gap-2 text-gold text-sm font-mono-custom uppercase tracking-wider">
                Explore <ArrowRightAltIcon sx={{ fontSize: 16 }} />
              </span>
            </div>
          </Link>

          {/* Right stack */}
          <div className="flex flex-col gap-4">
            <Link to="/shop?category=jackets" className="group relative overflow-hidden bg-graphite flex-1" style={{ aspectRatio: '4/3' }}>
              <img
                src="https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600"
                alt="Jackets"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-65 transition-all duration-700"
                style={{ transition: 'transform 0.7s ease, opacity 0.4s ease' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="font-display text-2xl font-bold text-pearl">Jackets</h3>
              </div>
            </Link>
            <Link to="/shop?category=dresses" className="group relative overflow-hidden bg-graphite flex-1" style={{ aspectRatio: '4/3' }}>
              <img
                src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"
                alt="Dresses"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-65 transition-all duration-700"
                style={{ transition: 'transform 0.7s ease, opacity 0.4s ease' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="font-display text-2xl font-bold text-pearl">Dresses</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { name: 'Priya Sharma', city: 'Mumbai', text: 'The Banarasi saree I ordered was absolutely stunning. The quality exceeded my expectations.', rating: 5 },
    { name: 'Ananya Krishnan', city: 'Bangalore', text: 'NAAVI\'s kurtas are my everyday go-to now. Love the chikankari collection!', rating: 5 },
    { name: 'Meera Patel', city: 'Ahmedabad', text: 'Fast delivery and beautiful packaging. The blazer fits perfectly.', rating: 5 },
  ];
  return (
    <section className="py-20 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="section-label mb-3">What They Say</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-pearl">Loved by Women</h2>
          <div className="gold-line w-16 mx-auto mt-4" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="bg-graphite border border-ash/30 p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(r.rating)].map((_, i) => (
                  <span key={i} className="text-gold text-sm">★</span>
                ))}
              </div>
              <p className="text-silver text-sm leading-relaxed italic font-display text-base">"{r.text}"</p>
              <div className="mt-5 pt-4 border-t border-ash/30">
                <p className="text-pearl text-sm font-semibold">{r.name}</p>
                <p className="section-label text-[9px] mt-0.5">{r.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [deals, setDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [d, n, b] = await Promise.all([
          API.get('/products?deal=true&limit=4'),
          API.get('/products?newArrival=true&limit=4'),
          API.get('/products?bestSeller=true&limit=4'),
        ]);
        setDeals(d.data.products);
        setNewArrivals(n.data.products);
        setBestSellers(b.data.products);
      } catch (err) {
        console.error('Home data error:', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian">
      <div className="text-center">
        <p className="font-display text-5xl text-gold mb-4">NAAVI</p>
        <Spinner size="md" />
      </div>
    </div>
  );

  return (
    <div className="bg-obsidian">
      <Hero />
      <FeatureStrip />
      <CategoryGrid />
      {newArrivals.length > 0 && (
        <ProductsSection title="New Arrivals" label="Just Dropped" products={newArrivals} viewLink="/shop?newArrival=true" />
      )}
      <EditorialBanner />
      {deals.length > 0 && <DealsBanner deals={deals} />}
      {bestSellers.length > 0 && (
        <ProductsSection title="Best Sellers" label="Fan Favourites" products={bestSellers} viewLink="/shop?bestSeller=true" />
      )}
      <Testimonials />
    </div>
  );
}
