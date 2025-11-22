import React from 'react';
import { Product } from '../../types/types';

interface ProductCardProps {
  product: Product;
  onBuy: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy }) => {
  return (
    <div style={styles.card}>
      {product.images.length > 0 && (
        <img
          src={product.images[0]}
          alt={product.title}
          style={styles.image}
        />
      )}
      <div style={styles.content}>
        <h3 style={styles.title}>{product.title}</h3>
        <p style={styles.description}>{product.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>{product.price}₽</span>
          <button
            style={styles.buyButton}
            onClick={() => onBuy(product.id)}
          >
            КУПИТЬ
          </button>
        </div>
        <div style={styles.sellerInfo}>
          Продавец: {product.seller.tradeName} ⭐{product.seller.rating}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    marginBottom: '12px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '160px',
    objectFit: 'cover' as const,
  },
  content: {
    padding: '12px',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: 600,
  },
  description: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#666',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  buyButton: {
    backgroundColor: '#0088cc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  sellerInfo: {
    fontSize: '12px',
    color: '#888',
  },
};