// utils.jsx

import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 * Use this in your components for conditional Tailwind classes.
 */
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}
