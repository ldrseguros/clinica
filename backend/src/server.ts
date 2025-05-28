import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Import auth routes
import authRoutes from './routes/authRoutes';
// Import user routes
import userRoutes from './routes/userRoutes';

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express API!');
});

// Mount auth routes
app.use('/api/auth', authRoutes);
// Mount user routes
app.use('/api/users', userRoutes);

// Import error handling middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';

// Register error handling middleware (must be last)
app.use(errorHandlerMiddleware);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
