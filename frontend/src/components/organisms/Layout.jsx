import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-obsidian">
      <Navbar />
      <main className="flex-1 page-enter">{children}</main>
      <Footer />
    </div>
  );
}
