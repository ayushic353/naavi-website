import React from 'react';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-ash/30 mt-24">
      {/* Top gold line */}
      <div className="gold-line" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">

          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" className="font-display text-4xl font-bold text-pearl tracking-[0.12em] hover:text-gold transition-colors">
              NAAVI
            </Link>
            <p className="mt-4 text-sm text-mist leading-relaxed max-w-xs">
              Curated women's fashion celebrating Indian heritage and contemporary elegance. Crafted with intention, worn with confidence.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="section-label mb-3">Join our inner circle</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="naavi-input flex-1 text-xs py-2.5"
                />
                <button type="submit" className="btn-gold py-2.5 px-4 text-xs">
                  Join
                </button>
              </form>
            </div>

            {/* Socials */}
            <div className="flex gap-4 mt-6">
              {[
                { icon: <InstagramIcon fontSize="small" />, label: 'Instagram' },
                { icon: <PinterestIcon fontSize="small" />, label: 'Pinterest' },
                { icon: <TwitterIcon fontSize="small" />, label: 'Twitter' },
                { icon: <YouTubeIcon fontSize="small" />, label: 'YouTube' },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="text-ash hover:text-gold transition-colors duration-300">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h3 className="section-label mb-5">Shop</h3>
            <ul className="space-y-3">
              {[
                ['New Arrivals', '/shop?newArrival=true'],
                ['Kurtas', '/shop?category=kurtas'],
                ['Sarees', '/shop?category=sarees'],
                ['Suits', '/shop?category=suits'],
                ['Dresses', '/shop?category=dresses'],
                ['Tops & T-Shirts', '/shop?category=tops'],
                ['Jeans', '/shop?category=jeans'],
                ['Sale', '/shop?deal=true'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-mist hover:text-gold underline-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help column */}
          <div>
            <h3 className="section-label mb-5">Help</h3>
            <ul className="space-y-3">
              {[
                ['FAQs', '/help'],
                ['Shipping Info', '/help#shipping'],
                ['Returns & Exchanges', '/help#returns'],
                ['Size Guide', '/help#sizing'],
                ['Track Order', '/orders'],
                ['Contact Us', '/contact'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-mist hover:text-gold underline-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="section-label mb-5">Company</h3>
            <ul className="space-y-3">
              {[
                ['About NAAVI', '/about'],
                ['Our Story', '/about#story'],
                ['Sustainability', '/about#sustainability'],
                ['Careers', '/about#careers'],
                ['Press', '/about#press'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-mist hover:text-gold underline-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact info */}
            <div className="mt-8">
              <h3 className="section-label mb-3">Contact</h3>
              <p className="text-sm text-mist">hello@naavi.in</p>
              <p className="text-sm text-mist mt-1">+91 98765 43210</p>
              <p className="text-sm text-mist mt-1">Mumbai, India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ash/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ash font-mono-custom">
            © {new Date().getFullYear()} NAAVI. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((t) => (
              <a key={t} href="#" className="text-xs text-ash hover:text-silver transition-colors font-mono-custom">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
