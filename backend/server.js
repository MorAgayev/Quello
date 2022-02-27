const express = require('express');
const expressSession = require('express-session');
const path = require('path')
const cors = require("cors");

const app = express();
const http = require('http').createServer(app);

// SERVER SETTINGS
const session = expressSession({
    secret: '<secretkey>',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});
app.use(express.json({ limit: '50mb' }));
app.use(session);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3030', 'http://localhost:3030'],
        credentials: true
    }
    app.use(cors(corsOptions));
}

// SET ROUTES
const userRoutes = require('./api/user/user.route');
const authRoutes = require('./api/auth/auth.route');
const boardRoutes = require('./api/boards/board.route');
const { connectSockets } = require('./service/socket.service');

const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware');
app.all('*', setupAsyncLocalStorage);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/board', boardRoutes);
connectSockets(http, session);

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// START SERVER
const logger = require('./service/logger.service');
const port = process.env.PORT || 3030;
http.listen(port, () => logger.info('Server is running', (process.env.NODE_ENV !== 'production') ? 'Development mode' : 'Production mode', `Address: http://localhost:${port}`));