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

export const isImage = (node: SceneNode): boolean => {
  if ("fills" in node) {
    return node.fills !== figma.mixed && node.fills.length > 0 && node.fills.some(fill => fill.type === "IMAGE" && fill.imageHash);
  }
  return false;
}

export const isNodeHasBackgroundImage = (node: SceneNode): boolean => {
  if ("fills" in node && node.type !== "RECTANGLE") {
    return node.fills !== figma.mixed && node.fills.length > 0 && node.fills.some(fill => fill.type === "IMAGE" && fill.imageHash);
  }
  return false;
}

export const isImageNode = (node: SceneNode): boolean => {
  if (
    node.type === "RECTANGLE" &&
    node.fills !== figma.mixed &&
    node.fills.length > 0
  ) {
    const fill = node.fills[0];
    return fill.type === "IMAGE" && !!fill.imageHash;
  }
  return false;
};
