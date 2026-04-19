import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../atoms/Spinner';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CartPage() {
  const { cartItems, cartTotal, cartLoading, updateCartItem, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal >= 2499 ? 0 : 149;
  const tax = +(cartTotal * 0.05).toFixed(2);
  const total = cartTotal + shipping + tax;

  if (cartLoading) return <div className="min-h-screen flex items-center justify-center bg-obsidian"><Spinner size="lg" /></div>;

  if (!user) return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-3xl text-pearl mb-4">Your Bag</p>
        <p className="text-mist mb-8">Please sign in to view your bag.</p>
        <Link to="/login" className="btn-gold">Sign In</Link>
      </div>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-5xl text-ash mb-4">Your bag is empty</p>
        <p className="text-mist mb-8 text-sm">Add something beautiful to get started.</p>
        <Link to="/shop" className="btn-gold">Explore Collections <ArrowForwardIcon sx={{ fontSize: 16 }} /></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-obsidian py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-pearl mb-10">Shopping Bag</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-ash/20 text-[9px] font-mono-custom uppercase tracking-widest text-mist">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {cartItems.map((item) => {
              if (!item.product) return null;
              return (
                <div key={item._id} className="grid md:grid-cols-12 gap-4 py-5 border-b border-ash/20 items-center">
                  <div className="md:col-span-6 flex gap-4 items-start">
                    <Link to={`/product/${item.product._id}`} className="w-20 h-24 flex-shrink-0 overflow-hidden bg-graphite block">
                      <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </Link>
                    <div>
                      <Link to={`/product/${item.product._id}`} className="text-sm font-medium text-pearl hover:text-gold transition-colors">{item.product.name}</Link>
                      <div className="mt-1 space-y-0.5">
                        {item.size && <p className="text-[10px] text-mist font-mono-custom">Size: {item.size}</p>}
                        {item.color && <p className="text-[10px] text-mist font-mono-custom">Colour: {item.color}</p>}
                      </div>
                      <button onClick={() => removeFromCart(item._id)}
                        className="mt-2 text-[10px] text-ember flex items-center gap-0.5 hover:opacity-70 font-mono-custom uppercase tracking-wider">
                        <DeleteOutlineIcon sx={{ fontSize: 12 }} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2 text-sm text-pearl md:text-center">₹{item.product.price.toLocaleString()}</div>
                  <div className="md:col-span-2 flex md:justify-center">
                    <div className="flex items-center border border-ash/40">
                      <button onClick={() => updateCartItem(item._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-silver hover:text-gold hover:bg-graphite transition-all">
                        <RemoveIcon sx={{ fontSize: 12 }} />
                      </button>
                      <span className="w-8 text-center text-sm font-mono-custom text-pearl">{item.quantity}</span>
                      <button onClick={() => updateCartItem(item._id, item.quantity + 1)} disabled={item.quantity >= item.product.stock}
                        className="w-8 h-8 flex items-center justify-center text-silver hover:text-gold hover:bg-graphite transition-all disabled:opacity-30">
                        <AddIcon sx={{ fontSize: 12 }} />
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2 text-sm font-semibold text-pearl md:text-right">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-charcoal border border-ash/30 p-6 sticky top-28">
              <h2 className="font-display text-2xl font-bold text-pearl mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-mist">Subtotal</span>
                  <span className="text-pearl">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Shipping</span>
                  <span className={shipping === 0 ? 'text-sage' : 'text-pearl'}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Tax (5%)</span>
                  <span className="text-pearl">₹{tax}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gold font-mono-custom">Add ₹{(2499 - cartTotal).toFixed(0)} more for free shipping</p>
                )}
              </div>
              <div className="gold-line my-5" />
              <div className="flex justify-between font-bold text-pearl">
                <span>Total</span>
                <span className="font-display text-2xl">₹{total.toLocaleString()}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-gold w-full justify-center mt-6">
                Proceed to Checkout <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </button>
              <Link to="/shop" className="block text-center text-[10px] font-mono-custom text-mist mt-4 hover:text-gold underline-gold transition-colors uppercase tracking-wider">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
