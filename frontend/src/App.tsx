import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ChatsPage from './pages/ChatsPage';
import ProfilePage from './pages/ProfilePage';
import CreateProductPage from './pages/CreateProductPage';
import { TelegramProvider } from './contexts/TelegramContext';
import './App.css';

const App: React.FC = () => {
  return (
    <TelegramProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create" element={<CreateProductPage />} />
          </Routes>
        </Layout>
      </Router>
    </TelegramProvider>
  );
};

export default App;