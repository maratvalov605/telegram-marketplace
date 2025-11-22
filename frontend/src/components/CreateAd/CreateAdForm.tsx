import React, { useState } from 'react';
import { CreateProductRequest } from '../../types/types';

interface CreateAdFormProps {
  userId: number;
  onSubmit: (productData: CreateProductRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const CreateAdForm: React.FC<CreateAdFormProps> = ({
  userId,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    type: 'sell' as 'sell' | 'buy'
  });

  const [images, setImages] = useState<string[]>([]);

  const categories = [
    { id: 1, name: 'Электроника', slug: 'electronics' },
    { id: 2, name: 'Одежда и обувь', slug: 'clothing' },
    { id: 3, name: 'Дом и сад', slug: 'home' },
    { id: 4, name: 'Автотовары', slug: 'auto' },
    { id: 5, name: 'Красота и здоровье', slug: 'beauty' },
    { id: 6, name: 'Спорт и отдых', slug: 'sports' },
    { id: 7, name: 'Игры и хобби', slug: 'games' },
    { id: 8, name: 'Книги', slug: 'books' },
    { id: 9, name: 'Другое', slug: 'other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.price || !formData.category) {
      alert('Заполните обязательные поля: название, цена и категория');
      return;
    }

    const productData: CreateProductRequest = {
      sellerId: userId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category,
      type: formData.type,
      images: images
    };

    onSubmit(productData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Временная заглушка для демо - просто добавляем placeholder
    const newImages = Array.from(files).slice(0, 5 - images.length).map(file => {
      return URL.createObjectURL(file); // В реальном приложении нужно загружать на сервер
    });

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Создать объявление</h2>
          <button style={styles.closeButton} onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Тип объявления */}
          <div style={styles.typeSelector}>
            <label style={styles.label}>Тип объявления</label>
            <div style={styles.typeButtons}>
              <button
                type="button"
                style={{
                  ...styles.typeButton,
                  ...(formData.type === 'sell' ? styles.activeTypeButton : {})
                }}
                onClick={() => setFormData(prev => ({ ...prev, type: 'sell' }))}
              >
                🛍️ Продам
              </button>
              <button
                type="button"
                style={{
                  ...styles.typeButton,
                  ...(formData.type === 'buy' ? styles.activeTypeButton : {})
                }}
                onClick={() => setFormData(prev => ({ ...prev, type: 'buy' }))}
              >
                💰 Куплю
              </button>
            </div>
          </div>

          {/* Заголовок */}
          <div style={styles.field}>
            <label style={styles.label}>
              Название товара *
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Например: iPhone 15 Pro Max 256GB"
                style={styles.input}
                maxLength={100}
                required
              />
            </label>
            <div style={styles.counter}>
              {formData.title.length}/100
            </div>
          </div>

          {/* Описание */}
          <div style={styles.field}>
            <label style={styles.label}>
              Описание
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Опишите товар подробно: состояние, комплектация, особенности..."
                style={styles.textarea}
                rows={4}
                maxLength={1000}
              />
            </label>
            <div style={styles.counter}>
              {formData.description.length}/1000
            </div>
          </div>

          {/* Цена */}
          <div style={styles.field}>
            <label style={styles.label}>
              Цена (₽) *
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0"
                style={styles.input}
                min="0"
                required
              />
            </label>
          </div>

          {/* Категория */}
          <div style={styles.field}>
            <label style={styles.label}>
              Категория *
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                style={styles.select}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Загрузка изображений */}
          <div style={styles.field}>
            <label style={styles.label}>
              Фотографии ({images.length}/5)
            </label>

            {/* Preview изображений */}
            {images.length > 0 && (
              <div style={styles.imagesPreview}>
                {images.map((image, index) => (
                  <div key={index} style={styles.imageItem}>
                    <img src={image} alt={`Preview ${index + 1}`} style={styles.previewImage} />
                    <button
                      type="button"
                      style={styles.removeImageButton}
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Кнопка загрузки */}
            {images.length < 5 && (
              <div style={styles.uploadArea}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={styles.fileInput}
                  id="image-upload"
                />
                <label htmlFor="image-upload" style={styles.uploadLabel}>
                  <div style={styles.uploadIcon}>📷</div>
                  <div style={styles.uploadText}>Добавить фото</div>
                  <div style={styles.uploadSubtext}>До 5 изображений</div>
                </label>
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={onCancel}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Создание...' : 'Создать объявление'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px 0',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px',
    color: '#666',
  },
  form: {
    padding: '24px',
  },
  typeSelector: {
    marginBottom: '20px',
  },
  typeButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  typeButton: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  activeTypeButton: {
    borderColor: '#0088cc',
    backgroundColor: '#f0f8ff',
    color: '#0088cc',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '6px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box' as const,
  },
  counter: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'right' as const,
    marginTop: '4px',
  },
  imagesPreview: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    marginBottom: '12px',
  },
  imageItem: {
    position: 'relative' as const,
    width: '80px',
    height: '80px',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    borderRadius: '8px',
  },
  removeImageButton: {
    position: 'absolute' as const,
    top: '-6px',
    right: '-6px',
    background: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadArea: {
    border: '2px dashed #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    cursor: 'pointer',
  },
  uploadIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  uploadText: {
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '4px',
  },
  uploadSubtext: {
    fontSize: '12px',
    color: '#666',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  cancelButton: {
    flex: 1,
    padding: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
  submitButton: {
    flex: 1,
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#0088cc',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
};