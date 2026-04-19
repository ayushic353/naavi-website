import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../api';
import ProductCard from '../molecules/ProductCard';
import Spinner from '../atoms/Spinner';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';

const CATS = [
  { label: 'All', slug: '' },
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

const SORTS = [
  { value: 'latest', label: 'Latest' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ShopPage() {
  const [sp, setSp] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = sp.get('category') || '';
  const search = sp.get('search') || '';
  const sort = sp.get('sort') || 'latest';
  const page = parseInt(sp.get('page') || '1', 10);
  const newArrival = sp.get('newArrival') || '';
  const deal = sp.get('deal') || '';
  const bestSeller = sp.get('bestSeller') || '';
  const minPrice = sp.get('minPrice') || '';
  const maxPrice = sp.get('maxPrice') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (category) p.set('category', category);
      if (search) p.set('search', search);
      if (sort) p.set('sort', sort);
      if (page > 1) p.set('page', page);
      if (newArrival) p.set('newArrival', newArrival);
      if (deal) p.set('deal', deal);
      if (bestSeller) p.set('bestSeller', bestSeller);
      if (minPrice) p.set('minPrice', minPrice);
      if (maxPrice) p.set('maxPrice', maxPrice);
      p.set('limit', '12');

      const { data } = await API.get(`/products?${p.toString()}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error('Shop fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, page, newArrival, deal, bestSeller, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const set = (key, val) => {
    const n = new URLSearchParams(sp);
    if (val) n.set(key, val); else n.delete(key);
    n.delete('page');
    setSp(n);
  };

  const setPage = (p) => {
    const n = new URLSearchParams(sp);
    p > 1 ? n.set('page', p) : n.delete('page');
    setSp(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clear = () => setSp({});
  const activeCount = [category, search, newArrival, deal, bestSeller, minPrice, maxPrice].filter(Boolean).length;

  const pageTitle = search ? `"${search}"` : category ? CATS.find(c => c.slug === category)?.label || 'Shop' : newArrival ? 'New Arrivals' : deal ? 'Deals' : 'All Products';

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Header */}
      <div className="bg-charcoal border-b border-ash/20 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="section-label mb-2">
            {search ? 'Search Results' : 'Shop'}
          </p>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-pearl">{pageTitle}</h1>
            <span className="font-mono-custom text-sm text-mist">{total} items</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Category strip */}
        <div className="flex gap-2 flex-wrap mb-6 pb-6 border-b border-ash/20">
          {CATS.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => set('category', cat.slug)}
              className={`px-4 py-1.5 text-[10px] font-mono-custom uppercase tracking-wider border transition-all duration-200 ${
                category === cat.slug
                  ? 'bg-gold text-obsidian border-gold'
                  : 'border-ash/50 text-mist hover:border-gold hover:text-pearl'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            {activeCount > 0 && (
              <button onClick={clear} className="text-xs text-ember font-mono-custom uppercase tracking-wider underline-gold">
                Clear ({activeCount})
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => set('sort', e.target.value)}
              className="naavi-input py-2 text-xs w-auto"
            >
              {SORTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={() => setFilterOpen(!filterOpen)} className="btn-ghost py-2 px-3 text-[10px]">
              <TuneIcon sx={{ fontSize: 14 }} /> Filters
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div className="mb-8 bg-graphite border border-ash/30 p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <p className="section-label">Filter Options</p>
              <button onClick={() => setFilterOpen(false)} className="text-mist hover:text-pearl">
                <CloseIcon fontSize="small" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <label className="section-label text-[9px] block mb-2">Min Price (₹)</label>
                <input type="number" value={minPrice} onChange={(e) => set('minPrice', e.target.value)} placeholder="0" className="naavi-input" />
              </div>
              <div>
                <label className="section-label text-[9px] block mb-2">Max Price (₹)</label>
                <input type="number" value={maxPrice} onChange={(e) => set('maxPrice', e.target.value)} placeholder="15000" className="naavi-input" />
              </div>
              <div className="flex flex-col gap-3 justify-center">
                {[
                  { key: 'newArrival', label: 'New Arrivals' },
                  { key: 'deal', label: 'On Sale' },
                  { key: 'bestSeller', label: 'Best Sellers' },
                ].map((f) => (
                  <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sp.get(f.key) === 'true'}
                      onChange={(e) => set(f.key, e.target.checked ? 'true' : '')}
                      className="accent-[#c9a96e] w-3.5 h-3.5"
                    />
                    <span className="text-sm text-silver">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <div className="flex justify-center py-32"><Spinner size="lg" /></div>
        ) : products.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-4xl text-ash mb-4">No products found</p>
            <p className="text-mist text-sm mb-8">Try different filters or search terms</p>
            <button onClick={clear} className="btn-outline-gold">Clear All Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-14">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="btn-ghost py-2 px-4 text-[10px] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 text-xs font-mono-custom border transition-all ${
                      p === page ? 'bg-gold text-obsidian border-gold' : 'border-ash/40 text-silver hover:border-gold hover:text-pearl'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                  className="btn-ghost py-2 px-4 text-[10px] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
