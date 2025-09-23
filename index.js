import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Todo from './models/Todo.js';
import todosRouter from './routers/todosRouter.js';

const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN || '*';
// Prefer MONGO_URI (common naming) then fallback to MONGO_URL, then local default
const MONGO_URL = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/todoapp';

// CORS 설정: 개발 환경에서 모든 오리진 허용
app.use(cors({
    origin: true, // 모든 오리진 허용
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
    credentials: false,
    optionsSuccessStatus: 200
}));

// 추가 헤더 설정으로 CORS 문제 완전 해결
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Referrer-Policy', 'no-referrer');
    res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.header('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'SAMEORIGIN');
    if (_req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
});
app.use(express.json());

// Mount routers
app.use('/api/todos', todosRouter); 

app.get('/health', (_req, res) => {
	res.json({ ok: true, mongoState: mongoose.connection.readyState });
});

// Debug endpoint to inspect current Mongo connection details
app.get('/debug/db', async (_req, res) => {
    try {
        const conn = mongoose.connection;
        const lists = await conn.db.listCollections().toArray();
        // Mask credentials in connection string if present
        const masked = (s) => {
            if (typeof s !== 'string') return s;
            // replace ":password@" with ":***@"; also handles SRV URIs
            return s.replace(/:[^@]+@/, ':***@');
        };
        res.json({
            uri: masked(process.env.MONGO_URI || process.env.MONGO_URL || ''),
            host: conn.host,
            name: conn.name, // database name
            collections: lists.map(c => c.name)
        });
    } catch (err) {
        res.status(500).json({ error: 'debug_failed', message: err.message });
    }
});

// 1) MongoDB "table" (collection): schema/model moved to models/Todo.js

// 2) REST API (list/create handled in routers/todosRouter.js)


// 부분 수정 라우트는 routers/todosRouter.js에서 처리

// 삭제 라우트는 routers/todosRouter.js에서 처리

async function start() {
	try {
		// Connect to MongoDB
		await mongoose.connect(MONGO_URL);
        console.log('MongoDB 연결 성공');
        const conn = mongoose.connection;
        console.log(`Mongo host: ${conn.host} | db: ${conn.name}`);
	} catch (err) {
		console.error('MongoDB 연결 실패:', err.message);
		process.exit(1);
	}

	app.listen(PORT, '0.0.0.0', () => {
		console.log(`Server listening on http://localhost:${PORT}`);
	});
}

start();

export default app;

