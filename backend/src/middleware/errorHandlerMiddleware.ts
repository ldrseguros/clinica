import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  status?: number;
}

export const errorHandlerMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction // next is declared but not used, which is standard for error handlers
) => {
  // Log the error for debugging purposes
  console.error(err.stack || err.message || err);

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Prepare response message
  let message = err.message || 'An unexpected error occurred.';
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error'; // Generic message for 500 in production
  }

  // Prepare response object
  const errorResponse: { status: number; message: string; stack?: string } = {
    status: statusCode,
    message: message,
  };

  // Include stack trace in development environment
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

export default errorHandlerMiddleware; // Also exporting as default for flexibility
