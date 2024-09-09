interface LoadingError extends Error {
  name: 'LoadingError';
  cause?: Error;
}

class LoadingError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'LoadingError';
    this.cause = cause;
  }
}

export { LoadingError };
