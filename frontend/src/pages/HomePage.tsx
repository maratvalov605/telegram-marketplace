import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { Product } from '../types';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({ limit: 8, offset: 0 });

        if (response && response.products && Array.isArray(response.products)) {
          setProducts(response.products);
          // Берем первые 3 продукта как featured
          setFeaturedProducts(response.products.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const stats = [
    { value: products.length, label: 'Active Products', icon: '🛒' },
    { value: '24/7', label: 'Support', icon: '🛡️' },
    { value: '100%', label: 'Secure', icon: '🔒' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to Telegram Market! 🛒</h1>
          <p className="text-blue-100 text-lg mb-6">
            Buy and sell safely within Telegram. Fast, secure, and easy to use.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            <span>🚀 Start Selling</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products ✨</h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.product_id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-6xl text-gray-400 group-hover:scale-110 transition-transform">📦</span>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {featuredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-6">Be the first to list your product!</p>
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <span>Add First Product</span>
            </Link>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Actions ⚡</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/products"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl text-center hover:shadow-lg transition-all group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🛒</div>
            <div className="font-semibold">Browse All</div>
            <div className="text-sm opacity-90">Discover products</div>
          </Link>
          <Link
            to="/create"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl text-center hover:shadow-lg transition-all group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💎</div>
            <div className="font-semibold">Sell Fast</div>
            <div className="text-sm opacity-90">List your item</div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;