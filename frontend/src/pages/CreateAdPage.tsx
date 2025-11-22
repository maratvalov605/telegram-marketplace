import React, { useState } from 'react';
import { CreateAdForm } from '../components/CreateAd/CreateAdForm';
import { CreateProductRequest } from '../types/types';

interface CreateAdPageProps {
  userId: number;
  onCreateProduct: (productData: CreateProductRequest) => Promise<void>;
  onBack: () => void;
}

export const CreateAdPage: React.FC<CreateAdPageProps> = ({
  userId,
  onCreateProduct,
  onBack
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (productData: CreateProductRequest) => {
    try {
      setLoading(true);
      await onCreateProduct(productData);
      // После успешного создания возвращаемся назад
      onBack();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Ошибка при создании объявления. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <CreateAdForm
        userId={userId}
        onSubmit={handleSubmit}
        onCancel={onBack}
        loading={loading}
      />
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '60px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
};