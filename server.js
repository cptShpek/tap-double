import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middleware/error';
import connectDB from './config/db';
import middlewares from './middleware/index';
import router from './routes/index';
import socketIO from 'socket.io';
import 'colors';
import runBalanceUpdater from './utils/balance-updater';
import runGameStarter from './utils/game-starter';

const PORT = process.env.PORT || 5000;
const SOCKET_PORT = process.env.SOCKET_PORT || 4000;
const app = express();
const io = socketIO(SOCKET_PORT);

// on sockets connection
io.on('connection', () => console.log('Connected to events'));

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Load middlewares
middlewares(app);

// on app init
runBalanceUpdater();
runGameStarter();

// Mount routers
router(app, io);

// Routes error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(
    `API server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold,
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
