const http = require('http');
const url = require('url');

const port = 3000;

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    console.log(`${req.method} ${req.url}`);

    // Health check
    if (pathname === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'OK', message: 'Backend is running!' }));
        return;
    }

    // Test endpoint
    if (pathname === '/api/test' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'API is working!' }));
        return;
    }

    // Users endpoint
    if (pathname === '/api/users' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const userData = JSON.parse(body || '{}');
            const user = {
                user_id: 1,
                telegram_id: userData.telegram_id || 123456,
                trade_name: 'Test User',
                rating: 5.0,
                trust_level: 'new',
                created_at: new Date().toISOString()
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        });
        return;
    }

    // Products endpoint with query parameters support
    if (pathname === '/api/products' && req.method === 'GET') {
        const limit = parseInt(query.limit) || 20;
        const offset = parseInt(query.offset) || 0;

        console.log(`Products request: limit=${limit}, offset=${offset}`);

        const products = {
            products: [
                {
                    product_id: 1,
                    title: 'Тестовый товар 1',
                    description: 'Описание тестового товара',
                    price: 1000,
                    category: 'electronics',
                    type: 'sell',
                    status: 'active',
                    images: []
                },
                {
                    product_id: 2,
                    title: 'Тестовый товар 2',
                    description: 'Еще один тестовый товар',
                    price: 500,
                    category: 'books',
                    type: 'sell',
                    status: 'active',
                    images: []
                },
                {
                    product_id: 3,
                    title: 'Игровая мышь',
                    description: 'Беспроводная игровая мышь',
                    price: 2500,
                    category: 'electronics',
                    type: 'sell',
                    status: 'active',
                    images: []
                }
            ],
            total: 3,
            limit: limit,
            offset: offset
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
        return;
    }

    // Chats endpoint
    if (pathname === '/api/chats' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ chats: [] }));
        return;
    }

    // 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found', path: pathname }));
});

server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Backend server running on http://0.0.0.0:${port}`);
    console.log('✅ API endpoints:');
    console.log('   GET  /health');
    console.log('   GET  /api/test');
    console.log('   POST /api/users');
    console.log('   GET  /api/products?limit=20&offset=0');
    console.log('   GET  /api/chats');
});

console.log('✅ Server starting...');