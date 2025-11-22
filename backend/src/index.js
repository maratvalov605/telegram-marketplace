import http from 'http';
import { StringDecoder } from 'string_decoder';

const PORT = process.env.PORT || 3000;

// CORS middleware
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': true
};

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    const { url, method } = req;
    const parsedUrl = new URL(url, `http://${req.headers.host}`);
    const path = parsedUrl.pathname;
    const query = Object.fromEntries(parsedUrl.searchParams);

    console.log(`${method} ${path}`);

    // Health check
    if (path === '/health' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'OK', message: 'Backend is running!' }));
      return;
    }

    // Test endpoint
    if (path === '/api/test' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'API is working!' }));
      return;
    }

    // Products endpoint
    if (path === '/api/products' && method === 'GET') {
      const mockProducts = [
        {
          product_id: 1,
          title: "Smartphone XYZ",
          description: "Latest smartphone with great features",
          price: 1000,
          category: "electronics",
          type: "sell",
          status: "active",
          images: []
        },
        {
          product_id: 2,
          title: "Programming Book",
          description: "Learn JavaScript programming",
          price: 500,
          category: "books",
          type: "sell",
          status: "active",
          images: []
        },
        {
          product_id: 3,
          title: "Wireless Headphones",
          description: "High quality wireless headphones",
          price: 2500,
          category: "electronics",
          type: "sell",
          status: "active",
          images: []
        }
      ];

      const limit = parseInt(query.limit) || 20;
      const offset = parseInt(query.offset) || 0;

      const response = {
        products: mockProducts.slice(offset, offset + limit),
        total: mockProducts.length,
        limit,
        offset
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
      return;
    }

    // Users endpoint
    if (path === '/api/users' && method === 'POST') {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'User created successfully',
        user_id: Math.floor(Math.random() * 1000)
      }));
      return;
    }

    // Chats endpoint
    if (path === '/api/chats' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        chats: [],
        message: 'Chats endpoint'
      }));
      return;
    }

    // Not found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log('✅ API endpoints:');
  console.log('   GET  /health');
  console.log('   GET  /api/test');
  console.log('   POST /api/users');
  console.log('   GET  /api/products?limit=20&offset=0');
  console.log('   GET  /api/chats');
});

export default server;