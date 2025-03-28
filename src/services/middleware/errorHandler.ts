import { APIError } from '../api/clients/baseClient';
import { z } from 'zod';

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: z.ZodError
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ContentProcessingError extends Error {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ContentProcessingError';
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public operation: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class EmailError extends Error {
  constructor(
    message: string,
    public recipient: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'EmailError';
  }
}

export function handleError(error: unknown): never {
  if (error instanceof APIError) {
    console.error(`API Error: ${error.message}`, {
      status: error.status,
      data: error.data
    });
    throw new ContentProcessingError(
      `Failed to fetch content from API: ${error.message}`,
      error
    );
  }

  if (error instanceof ValidationError) {
    console.error('Validation Error:', {
      message: error.message,
      errors: error.errors
    });
    throw new ContentProcessingError(
      'Content validation failed',
      error
    );
  }

  if (error instanceof DatabaseError) {
    console.error(`Database Error (${error.operation}):`, {
      message: error.message,
      originalError: error.originalError
    });
    throw new ContentProcessingError(
      `Database operation failed: ${error.message}`,
      error
    );
  }

  if (error instanceof EmailError) {
    console.error(`Email Error (${error.recipient}):`, {
      message: error.message,
      originalError: error.originalError
    });
    throw new ContentProcessingError(
      `Failed to send email: ${error.message}`,
      error
    );
  }

  // Handle unknown errors
  console.error('Unknown Error:', error);
  throw new ContentProcessingError(
    'An unexpected error occurred',
    error instanceof Error ? error : new Error(String(error))
  );
}

export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError;
}

export function isEmailError(error: unknown): error is EmailError {
  return error instanceof EmailError;
}

export function isContentProcessingError(error: unknown): error is ContentProcessingError {
  return error instanceof ContentProcessingError;
} 