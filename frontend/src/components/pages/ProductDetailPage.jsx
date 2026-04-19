import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../atoms/Spinner';
import toast from 'react-hot-toast';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selImage, setSelImage] = useState(0);
  const [selSize, setSelSize] = useState('');
  const [selColor, setSelColor] = useState('');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
        setSelSize(data.product.sizes?.[0] || '');
        setSelColor(data.product.colors?.[0] || '');
      } catch {
        toast.error('Product not found');
        navigate('/shop');
      } finally { setLoading(false); }
    })();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product.sizes?.length && !selSize) { toast.error('Please select a size'); return; }
    addToCart(product._id, qty, selSize, selColor);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    if (!reviewForm.comment.trim()) { toast.error('Please write a comment'); return; }
    setSubmitting(true);
    try {
      await API.post(`/products/${id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally { setSubmitting(false); }
  };

  const disc = product?.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian">
      <Spinner size="lg" />
    </div>
  );
  if (!product) return null;

  return (
    <div className="min-h-screen bg-obsidian py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs font-mono-custom text-mist">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-gold transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-silver line-clamp-1">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="flex gap-3">
            {product.images?.length > 1 && (
              <div className="flex flex-col gap-2 w-16">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelImage(i)}
                    className={`aspect-square overflow-hidden border-2 transition-all ${selImage === i ? 'border-gold' : 'border-ash/30'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 aspect-[3/4] overflow-hidden bg-graphite">
              <img
                src={product.images?.[selImage] || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=700'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="section-label mb-3 capitalize">{product.category}</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-pearl leading-tight">{product.name}</h1>

            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[1,2,3,4,5].map((s) => s <= Math.round(product.rating)
                    ? <StarIcon key={s} sx={{ fontSize: 14, color: '#c9a96e' }} />
                    : <StarBorderIcon key={s} sx={{ fontSize: 14, color: '#c9a96e' }} />)}
                </div>
                <span className="text-xs font-mono-custom text-mist">{product.rating} ({product.numReviews})</span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-5">
              <span className="font-display text-4xl font-bold text-pearl">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-mist line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="naavi-badge bg-ember text-white">-{disc}%</span>
                </>
              )}
            </div>

            <div className="gold-line my-6" />

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <p className="section-label text-[9px] mb-3">Colour: <span className="text-silver normal-case tracking-normal">{selColor}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button key={c} onClick={() => setSelColor(c)}
                      className={`px-4 py-1.5 text-xs border transition-all ${selColor === c ? 'border-gold bg-gold/10 text-gold' : 'border-ash/40 text-mist hover:border-silver'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-5">
                <p className="section-label text-[9px] mb-3">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSelSize(s)}
                      className={`w-12 h-10 text-sm border transition-all ${selSize === s ? 'border-gold bg-gold/10 text-gold' : 'border-ash/40 text-mist hover:border-silver'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="mb-7">
              <p className="section-label text-[9px] mb-3">Quantity</p>
              <div className="flex items-center border border-ash/40 w-fit">
                <button onClick={() => setQty(q => Math.max(1, q-1))}
                  className="w-10 h-10 text-silver hover:text-gold hover:bg-graphite transition-all text-lg">−</button>
                <span className="w-10 text-center text-sm font-mono-custom text-pearl">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))}
                  disabled={qty >= product.stock}
                  className="w-10 h-10 text-silver hover:text-gold hover:bg-graphite transition-all text-lg disabled:opacity-30">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="btn-gold flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
              </button>
              <button onClick={() => toggleWishlist(product._id)}
                className="btn-outline-gold w-12 h-12 p-0 justify-center" aria-label="Wishlist">
                {isWishlisted(product._id)
                  ? <FavoriteIcon sx={{ fontSize: 18, color: '#c9a96e' }} />
                  : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
              </button>
            </div>

            {/* Perks */}
            <div className="mt-7 space-y-2.5 pt-6 border-t border-ash/20">
              {[
                [<LocalShippingOutlinedIcon sx={{ fontSize: 14 }} />, 'Free delivery on orders above ₹2499'],
                [<LoopIcon sx={{ fontSize: 14 }} />, '30-day returns & exchanges'],
                [<VerifiedOutlinedIcon sx={{ fontSize: 14 }} />, '100% authentic, quality checked'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-2 text-xs text-mist">
                  <span className="text-gold">{icon}</span> {text}
                </div>
              ))}
            </div>

            {product.stock > 0 && product.stock <= 10 && (
              <p className="mt-4 text-xs font-mono-custom text-ember">Only {product.stock} left!</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-b border-ash/20">
          {['desc', 'reviews'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-4 text-[10px] font-mono-custom uppercase tracking-widest transition-all ${tab === t ? 'border-b-2 border-gold text-gold' : 'text-mist hover:text-silver'}`}>
              {t === 'reviews' ? `Reviews (${product.numReviews})` : 'Description'}
            </button>
          ))}
        </div>

        <div className="py-10 max-w-3xl">
          {tab === 'desc' ? (
            <div>
              <p className="text-silver leading-relaxed">{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-6">
                  {product.tags.map((tag) => (
                    <span key={tag} className="naavi-badge border border-ash/40 text-mist">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {product.reviews?.length === 0
                ? <p className="text-mist text-sm">No reviews yet. Be the first!</p>
                : (
                  <div className="space-y-6 mb-10">
                    {product.reviews.map((r, i) => (
                      <div key={i} className="border-b border-ash/20 pb-5">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-pearl">{r.name}</p>
                          <span className="text-[10px] font-mono-custom text-mist">
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex mb-2">
                          {[1,2,3,4,5].map((s) => s <= r.rating
                            ? <StarIcon key={s} sx={{ fontSize: 12, color: '#c9a96e' }} />
                            : <StarBorderIcon key={s} sx={{ fontSize: 12, color: '#c9a96e' }} />)}
                        </div>
                        <p className="text-sm text-silver">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )
              }

              {user ? (
                <form onSubmit={handleReview} className="space-y-4">
                  <h3 className="font-display text-2xl text-pearl">Write a Review</h3>
                  <div>
                    <p className="section-label text-[9px] mb-2">Your Rating</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((s) => (
                        <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                          className="text-gold transition-transform hover:scale-110">
                          {s <= reviewForm.rating
                            ? <StarIcon sx={{ fontSize: 22 }} />
                            : <StarBorderIcon sx={{ fontSize: 22 }} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="section-label text-[9px] mb-2">Comment</p>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      rows={4} required
                      placeholder="Share your experience with this product…"
                      className="naavi-input resize-none"
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-gold disabled:opacity-50">
                    {submitting ? 'Submitting…' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="text-sm text-mist">
                  <Link to="/login" className="text-gold underline-gold">Sign in</Link> to write a review.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
