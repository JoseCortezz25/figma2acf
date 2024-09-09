import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatError(error: any) {
  let errorMessage;
  if (error instanceof Error) errorMessage = error.message;
  else errorMessage = String(error);
  return errorMessage;
}
